import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Details } from 'src/app/shared/interfaces/order.interface';
import { Store } from 'src/app/shared/interfaces/stores.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from '../products/interfaces/product.interface';
import { ProductsService } from '../products/services/products.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: ''
  };
  isDelivery = true;
  cart: Product[] = [];
  stores: Store[] = [];
  constructor(
    private dataSvc: DataService,
    private shoppingCartSvc: ShoppingCartService, 
    private router: Router, 
    private productsSvc: ProductsService
    ) {
      this.checkCartIsEmpty();
     }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
  }

  onSubmit({ value: formData }: NgForm): void {
    console.log("Formulario lanzado", formData);
    const data = {
      ...formData,
      date: this.getCurrentDay(),
      pickup: this.isDelivery
    }
    this.dataSvc.saveOrder(data)
      .pipe(
        switchMap(({ id: orderId }) => {
          const details = this.prepareDetails();
          return this.dataSvc.saveDetailsOrder({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thank-you-page'])),
        delay(1000),
        tap(() => this.shoppingCartSvc.resetCart())
      )
      .subscribe();
  }

  private getStores(): void {
    this.dataSvc
      .getStores()
      .pipe(
        tap((stores: Store[]) => this.stores = stores)
      )
      .subscribe();
  }

  private getCurrentDay(): string {
    return new Date().toLocaleString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, qty: quantity, stock } = product;
      const updateStock = (stock - quantity);
      this.productsSvc.updateStock(productId, updateStock)
      .pipe(
       tap(() => details.push({ productId, productName, quantity }))
      )
      .subscribe()
     
    })
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartSvc.cartAction$
      .pipe(
        tap((products: Product[]) => this.cart = products)
      )
      .subscribe();
  }

  private checkCartIsEmpty(): void{
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap((products: Product[]) => {
        if(Array.isArray(products) && !products.length){
          this.router.navigate(['/products']);
        }
      })
    )
    .subscribe()
  }

}

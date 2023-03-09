import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Product } from './interfaces/product.interface';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products!:Product[];
  constructor(private productsSvc: ProductsService, private shoppingCartSvc: ShoppingCartService) { }

  ngOnInit(): void {
      this.productsSvc.getProducts()
      .pipe(
        tap( (productsList: Product[])  =>this.products = productsList)
      )
      .subscribe();
  }

  addToCart(product: Product):void{
    this.shoppingCartSvc.updateCart(product);
  }
}

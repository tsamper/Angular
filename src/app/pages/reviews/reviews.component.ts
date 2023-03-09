import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ReviewsService } from './services/reviews.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit{
  constructor(private reviewSvc:ReviewsService) {}

  ngOnInit(): void {
      this.reviewSvc.getReviews()
      .pipe(
        tap(res => console.log(res))
      )
      .subscribe();
  }
}

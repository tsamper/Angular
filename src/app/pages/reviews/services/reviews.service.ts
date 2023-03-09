import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../interfaces/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private apiURL = 'http://localhost:8090/reviews';
  constructor(private http: HttpClient) { }

  getReviews():Observable<Review[]>{
    return this.http.get<Review[]>(this.apiURL);
  }
}

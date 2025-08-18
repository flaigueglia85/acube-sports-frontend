import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private discount$ = new BehaviorSubject<number>(0);
  discount = this.discount$.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<{ discount: number }>('/wp-json/custom/v1/discount', { withCredentials: true })
      .subscribe(res => this.discount$.next(res.discount));
  }

  getCurrentDiscount(): number {
    return this.discount$.getValue();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CouponService {
  constructor(private http: HttpClient) {}

  apply(code: string): Observable<any> {
    return this.http.post('/wp-json/acube/v1/apply-coupon', { code }, { withCredentials: true });
  }

  remove(code: string): Observable<any> {
    return this.http.delete(`/wp-json/acube/v1/remove-coupon/${code}`, { withCredentials: true });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CheckoutItem {
  id: number;
  name: string;
  quantity: number;
  subtotal: number;
  sku?: string;
}

export interface CheckoutPayload {
  email: string;
  newsletter?: boolean;
  items: CheckoutItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly base = '/wp-json/custom/v1/orders';

  constructor(private http: HttpClient) {}

  submitOrder(payload: CheckoutPayload): Observable<{ success: boolean; order_id: number }> {
    return this.http
      .post<{ success: boolean; order_id: number }>(this.base, payload, { withCredentials: true });
  }
}

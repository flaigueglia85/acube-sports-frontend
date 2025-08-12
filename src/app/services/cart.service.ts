// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface CartItem {
  key: string;
  product_id: number;
  name: string;
  quantity: number;
  subtotal_raw: number;
  image?: string | null;
}
export interface Cart { items: CartItem[]; total_raw: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly base = '/wp-json/custom/v1/cart';

  private _cart$ = new BehaviorSubject<Cart>({ items: [], total_raw: 0 });
  cartUpdated$ = this._cart$.asObservable();

  constructor(private http: HttpClient) { }

  private emitCart(c: Cart) { this._cart$.next(c); }

  get(): Observable<Cart> {
    return this.http.get<Cart>(this.base, { withCredentials: true })
      .pipe(tap(c => this.emitCart(c)));
  }

  add(productId: number, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/add`, { product_id: productId, quantity }, { withCredentials: true })
      .pipe(tap(c => this.emitCart(c)));
  }

  update(key: string, quantity: number, productId?: number): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.base}/update`,
      { key, quantity, product_id: productId }, // 👈 mandiamo entrambi
      { withCredentials: true }
    ).pipe(tap(c => this.emitCart(c)));
  }

  remove(key: string, productId?: number) {
    return this.http.post<Cart>(`${this.base}/remove`, { key, product_id: productId }, { withCredentials: true })
      .pipe(tap(c => this.emitCart(c)));
  }

  clear(): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/clear`, {}, { withCredentials: true })
      .pipe(tap(c => this.emitCart(c)));
  }

  checkout(payload: any): Observable<any> {
    return this.http
      .post<any>('/wp-json/custom/v1/checkout', payload, { withCredentials: true })
      .pipe(tap(() => this.emitCart({ items: [], total_raw: 0 })));
  }
}

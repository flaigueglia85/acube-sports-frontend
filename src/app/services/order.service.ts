import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawOrderData } from './order-pdf.service';


@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrder(id: number): Observable<RawOrderData> {
    return this.http.get<RawOrderData>(`/wp-json/custom/v1/orders/${id}`, { withCredentials: true });
  }
}

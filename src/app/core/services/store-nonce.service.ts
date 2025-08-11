// src/app/core/services/store-nonce.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreNonceService {
  nonce = '';

  constructor(private http: HttpClient) {}

  /** chiamata in APP_INITIALIZER  */
  async init() {
    this.nonce = await firstValueFrom(
      this.http.get('/wp-json/acube/v1/nonce', { responseType: 'text' })
    );
  }
}

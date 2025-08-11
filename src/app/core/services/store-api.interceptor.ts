// src/app/core/interceptors/store-api.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StoreApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/wp-json/wc/store/')) {
      req = req.clone({
        withCredentials: true,
        setHeaders: {
          'X-WP-Nonce': window.localStorage.getItem('wp_nonce') || ''
        }
      });
    }
    return next.handle(req);
  }
}

// woo-auth.interceptor.class.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders
} from '@angular/common/http';
import { environment } from '../../../environment/environment';


@Injectable()
export class WooAuthInterceptorClass implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.startsWith('/wp-json/')) {
      const token = btoa(`${environment.wooCK}:${environment.wooCS}`);
      req = req.clone({
        headers: new HttpHeaders({ Authorization: `Basic ${token}` }),
      });
      console.debug('AUTH >>', req.headers.get('Authorization'));
    }
    return next.handle(req);
  }
}

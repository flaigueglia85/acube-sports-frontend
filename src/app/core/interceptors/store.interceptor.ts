import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

@Injectable()
export class StoreInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/wp-json/wc/store/')) {
      const nonce = this.auth.getWpNonce();

      const clonedReq = req.clone({
        setHeaders: {
          'Nonce': nonce || ''
        },
        withCredentials: true
      });

      // NON aggiungere Authorization qui
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}

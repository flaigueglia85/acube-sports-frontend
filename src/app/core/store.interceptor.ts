import { HttpInterceptorFn } from '@angular/common/http';

export const storeInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/wp-json/wc/store')) {
    req = req.clone({ withCredentials: true });
  }
  return next(req);
};

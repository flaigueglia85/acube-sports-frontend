// src/app/features/product-catalog/services/product-detail-drawer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class ProductDetailDrawerService {
  private _product$ = new BehaviorSubject<Product|null>(null);
  readonly product$ = this._product$.asObservable();
  readonly isOpen$ = this.product$.pipe(map(Boolean)); // <- corretto

  open(p: Product) { this._product$.next(p); }
  close() { this._product$.next(null); }
}

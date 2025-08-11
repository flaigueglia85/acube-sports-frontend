import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail-drawer',
  standalone: true,
  imports: [CommonModule, NgIf, MatButtonModule],
  template: `
<div class="min-w-[360px] max-w-[560px] p-4">
  <div class="flex justify-between items-start gap-2">
    <h2 class="text-lg font-semibold">{{ product?.name }}</h2>
    <button mat-button (click)="close.emit()">Chiudi</button>
  </div>

  <img *ngIf="product?.images?.[0]?.src" [src]="product!.images![0].src" [alt]="product?.name" class="mt-3 h-48 object-contain"/>

  <div class="mt-4 grid gap-1 text-sm" *ngIf="product">
    <div><span class="font-medium">SKU:</span> {{ product.sku }}</div>
    <div><span class="font-medium">Prezzo:</span> {{ product.price | currency:'EUR' }}</div>
    <div><span class="font-medium">Disponibilità:</span>
      {{ product.stock_status === 'outofstock' ? 'Esaurito' : 'Disponibile' }}
    </div>
  </div>

  <div class="mt-6 flex gap-2" *ngIf="product">
    <button mat-flat-button color="primary" (click)="add()">Aggiungi all’ordine</button>
    <button mat-stroked-button (click)="close.emit()">Chiudi</button>
  </div>
</div>
`,
})
export class ProductDetailDrawerComponent {
  @Input() product!: Product | null;
  @Output() close = new EventEmitter<void>();
  constructor(private cart: CartService) {}
  add() { if (this.product) this.cart.add(this.product.id, 1).subscribe(); }
}

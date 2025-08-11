import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductDetailDrawerService } from '../../services/product-detail-drawer.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],              // <- aggiunto FormsModule
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() add = new EventEmitter<{ id: number; qty: number }>();

    constructor(
    private cart: CartService,
    private drawer: ProductDetailDrawerService
  ) {}

  qty = 1;

  get maxQty(): number {
    if (this.product.manage_stock) {
      const q = this.product.stock_quantity ?? 0;
      return this.product.backorders_allowed ? Math.max(q, 9999) : Math.max(q, 0);
    }
    return 9999;
  }

  get canIncrement(): boolean { return this.qty < this.maxQty; }
  get canDecrement(): boolean { return this.qty > 1; }

  increment() { if (this.canIncrement) this.qty++; }
  decrement() { if (this.canDecrement) this.qty--; }

  onQtyInput(val: number | string) {
    const n = Math.max(1, Number(val) || 1);
    this.qty = Math.min(n, this.maxQty);
  }

  addToCart() {
    if (this.product.stock_status === 'outofstock') return;
    this.qty = Math.min(this.qty, this.maxQty); // clamp finale
    this.add.emit({ id: this.product.id, qty: this.qty });
  }

  get availabilityLabel(): string {
    if (this.product.stock_status === 'outofstock') return 'Esaurito';
    if (this.product.manage_stock) {
      const q = this.product.stock_quantity ?? 0;
      if (q <= 0 && this.product.backorders_allowed) return 'Disponibile su ordinazione';
      return `Disponibili: ${q}`;
    }
    return 'Disponibile';
  }

  openDetail() {
    this.drawer.open(this.product);
  }
}

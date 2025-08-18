import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerService } from '@shell/drawer/drawer.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { ProductDetailPanelComponent } from '../product-detail-panel/product-detail-panel.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() add = new EventEmitter<{ id: number; qty: number }>();

  constructor(
    private cart: CartService,
    private drawer: DrawerService
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

  // prezzo già scontato lato backend -> niente ricalcoli
  get hasUserDiscount(): boolean {
    return (this.product.price_raw ?? this.product.price) > this.product.price + 0.0001;
  }
  get userDiscountPercent(): number {
    const raw = this.product.price_raw ?? this.product.price;
    return raw > 0 ? Math.round((1 - this.product.price / raw) * 100) : 0;
  }

  increment() { if (this.canIncrement) this.qty++; }
  decrement() { if (this.canDecrement) this.qty--; }
  onQtyInput(val: number | string) {
    const n = Math.max(1, Number(val) || 1);
    this.qty = Math.min(n, this.maxQty);
  }
  addToCart() {
    if (this.product.stock_status === 'outofstock') return;
    this.qty = Math.min(this.qty, this.maxQty);
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
    this.drawer.open({
      component: ProductDetailPanelComponent,
      data: { product: this.product },
    });
  }
}

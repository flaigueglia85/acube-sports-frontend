import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { DRAWER_DATA, DrawerRef } from '@shell/drawer/drawer.token';
import { Product } from 'app/services/product.service';

@Component({
  selector: 'app-product-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./product-detail-panel.component.scss'],
  templateUrl: './product-detail-panel.component.html',
})
export class ProductDetailPanelComponent {
  product: Product = (inject(DRAWER_DATA) as { product: Product }).product;
  private ref = inject(DrawerRef);
  qty = 1;

  addToCart() {
    console.log('Aggiunto al carrello:', this.product.name, 'x', this.qty);
    // integra con CartService qui
  }

  close() {
    this.ref.close();
  }
}

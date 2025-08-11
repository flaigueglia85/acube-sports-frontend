import { Component, Inject, Input, inject } from '@angular/core';
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
  data = inject(DRAWER_DATA) as { product: Product };
  ref = inject(DrawerRef);

  product;
  qty = 1;

  constructor(
    @Inject(DRAWER_DATA) public drawerData: Product,
    @Inject(DrawerRef) private drawerRef: DrawerRef<any>
  ) { 

    this.product=drawerData;

  }

  addToCart() {
    console.log('Aggiunto al carrello:', this.product.name, 'x', this.qty);
    // integra con CartService qui
  }

  close() {
    this.ref.close();
  }
}

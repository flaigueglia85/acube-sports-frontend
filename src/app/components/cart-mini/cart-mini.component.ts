import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { heroTrash, heroMinusSmall, heroPlusSmall } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';

import { Observable } from 'rxjs';
import { Cart, CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-mini',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  templateUrl: './cart-mini.component.html',
  styleUrls: ['./cart-mini.component.scss'],
  providers: [provideIcons({ heroTrash, heroMinusSmall, heroPlusSmall })]
})
export class CartMiniComponent {
  cart$: Observable<Cart> = this.cartService.cartUpdated$;

  /** disabilita controlli per item in update/remove */
  busy = new Set<string>();
  clearing = false;

  constructor(private cartService: CartService) { }

  dec(it: CartItem) {
    if (this.busy.has(it.key)) return;
    this.busy.add(it.key);

    const nextQty = it.quantity - 1;
    const obs = nextQty <= 0
      ? this.cartService.remove(it.key, it.product_id)        // 👈 rimuovi a 0
      : this.cartService.update(it.key, nextQty, it.product_id);

    obs.subscribe({ complete: () => this.busy.delete(it.key) });
  }

  inc(it: CartItem) {
    if (this.busy.has(it.key)) return;
    this.busy.add(it.key);
    this.cartService.update(it.key, it.quantity + 1, it.product_id).subscribe({
      complete: () => this.busy.delete(it.key)
    });
  }

  remove(it: CartItem) {
    if (this.busy.has(it.key)) return;
    this.busy.add(it.key);
    this.cartService.remove(it.key,it.product_id).subscribe({
      complete: () => this.busy.delete(it.key)
    });
  }

  clearCart() {
    if (this.clearing) return;
    this.clearing = true;
    this.cartService.clear().subscribe({
      complete: () => this.clearing = false
    });
  }
}
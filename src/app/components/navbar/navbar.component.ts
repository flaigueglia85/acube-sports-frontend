import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationStart, Route, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BehaviorSubject, map } from 'rxjs';
import { CartMiniComponent } from '../cart-mini/cart-mini.component';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHome, heroShoppingBag, heroShoppingCart, heroBars3, heroXMark,
  heroClipboardDocumentCheck
} from '@ng-icons/heroicons/outline';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CartMiniComponent, NgIconComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [provideIcons({ heroHome, heroShoppingBag, heroShoppingCart, heroBars3, heroXMark, heroClipboardDocumentCheck })]
})
export class NavbarComponent implements OnInit {
  itemCount$ = new BehaviorSubject<number>(0);
  isAuthenticated = false;

  mobileOpen = false;
  cartOpen = false;         // desktop popup
  cartMobileOpen = false;   // mobile accordion

  constructor(
    private cartService: CartService,
    public auth: AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();

    if (this.isAuthenticated) {
      // badge live
      this.cartService.cartUpdated$
        .pipe(map(cart => cart.items.reduce((sum, it) => sum + it.quantity, 0)))
        .subscribe(count => this.itemCount$.next(count));

      // inizializza stato
      this.cartService.get().subscribe();
    }

    // 👇 chiudi carrello quando navighi verso checkout (o ovunque)
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.cartOpen = false;
        this.cartMobileOpen = false;
      }
    });
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
    if (!this.mobileOpen) this.cartMobileOpen = false;
  }
  closeMobile() { this.mobileOpen = false; this.cartMobileOpen = false; }

  toggleCart() { this.cartOpen = !this.cartOpen; }
  toggleCartMobile() { this.cartMobileOpen = !this.cartMobileOpen; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    const inside = t.closest('app-navbar');
    if (!inside) {
      this.cartOpen = false;
      this.mobileOpen = false;
      this.cartMobileOpen = false;
    }
  }
}

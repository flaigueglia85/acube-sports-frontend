import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Cart, CartService } from '../../services/cart.service';
import { ToastService } from '../../services/common/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutService } from 'app/services/checkout.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { OrdersService } from 'app/services/order.service';
import { CouponService } from 'app/services/coupon.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  customer = { email: '' };
  newsletter = false;
  acceptTerms = false;
  loading = true;
  submitting = false;
  couponCode = '';
  appliedCoupons: string[] = [];

  constructor(
    private cartService: CartService,
    private checkout: CheckoutService,
    private toast: ToastService,
    private ordersService: OrdersService,
    private router: Router,
    private auth: AuthService,
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
    this.cartService.get().subscribe({
      next: c => {
        this.cart = c;
        this.loading = false; // caricamento completato
      },
      error: () => {
        this.loading = false;
      }
    });

    const userInfo = this.auth.getUserInfo();
    if (userInfo?.email) {
      this.customer.email = userInfo.email;
    } else {
      // fallback
      fetch('/wp-json/custom/v1/me', { credentials: 'include' })
        .then(r => r.json())
        .then(m => { if (m?.logged_in && m.email) this.customer.email = m.email; })
        .catch(() => { });
    }
  }

  submitOrder(f: NgForm) {
    if (f.invalid || !this.acceptTerms) {
      this.toast.warning('Compila tutti i campi obbligatori prima di procedere.');
      return;
    }
    if (!this.cart || !this.cart.items.length) {
      this.toast.warning('Il carrello è vuoto.');
      return;
    }

    this.submitting = true;

    const payload = {
      email: this.customer.email,
      newsletter: this.newsletter,
      items: this.cart.items.map(i => ({
        id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        subtotal: i.subtotal_raw,
        sku: i.sku
      })),
      total: this.cart.total_raw
    };

    this.checkout.submitOrder(payload).subscribe({
      next: (res) => {
        this.cartService.clear().subscribe();
        this.ordersService.getOrder(res.order_id).subscribe(orderData => {
          this.toast.success('Ordine inviato con successo.');
          this.router.navigate(['/conferma-ordine'], { state: { order: orderData } });
          this.submitting = false;
        });
      },
      error: err => {
        this.toast.warning('Errore durante la conferma dell’ordine. Riprova più tardi.');
        this.submitting = false;
      }
    });
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      this.toast.warning('Inserisci un codice coupon.');
      return;
    }
    this.couponService.apply(this.couponCode).subscribe({
      next: (res) => {
        this.toast.success('Coupon applicato con successo.');
        this.appliedCoupons = res.coupons;
        this.refreshCart();
        this.couponCode = '';
      },
      error: () => this.toast.warning('Coupon non valido o scaduto.')
    });
  }

  removeCoupon(code: string) {
    this.couponService.remove(code).subscribe({
      next: (res) => {
        this.toast.success('Coupon rimosso.');
        this.appliedCoupons = res.coupons;
        this.refreshCart();
      },
      error: () => this.toast.warning('Errore nella rimozione del coupon.')
    });
  }

  private refreshCart() {
    this.cartService.get().subscribe(c => this.cart = c);
  }
}

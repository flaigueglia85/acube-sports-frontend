import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, CartService } from '../../services/cart.service';
import { ToastService } from '../../services/common/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  customer = { email: '' };
  newsletter = false;
  acceptTerms = false;

  constructor(
    private cartService: CartService,
    private toast: ToastService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.get().subscribe(c => (this.cart = c));
    const userInfo = this.auth.getUserInfo();
    if (userInfo?.email) {
      this.customer.email = userInfo.email;
    }
  }

  submitOrder(): void {
    this.cartService.checkout({ customer: this.customer, newsletter: this.newsletter }).subscribe({
      next: () => {
        this.toast.success('Ordine completato con successo');
        this.router.navigate(['/home']);
      },
      error: () => this.toast.error('Errore durante il checkout')
    });
  }
}

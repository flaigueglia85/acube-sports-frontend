import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, CartService } from '../../services/cart.service';
import { ToastService } from '../../services/common/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  customer = { name: '', address: '', email: '' };

  constructor(
    private cartService: CartService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.get().subscribe(c => (this.cart = c));
  }

  submitOrder(): void {
    this.cartService.checkout({ customer: this.customer }).subscribe({
      next: () => {
        this.toast.success('Ordine completato con successo');
        this.router.navigate(['/home']);
      },
      error: () => this.toast.error('Errore durante il checkout')
    });
  }
}

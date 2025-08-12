import { Component, OnInit } from '@angular/core';
import { Cart, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.get().subscribe(res => this.cart = res);
  }

  updateQuantity(key: string, quantity: number): void {
    this.cartService.update(key, +quantity).subscribe(() => this.loadCart());
  }

  removeItem(key: string): void {
    this.cartService.remove(key).subscribe(() => this.loadCart());
  }
}

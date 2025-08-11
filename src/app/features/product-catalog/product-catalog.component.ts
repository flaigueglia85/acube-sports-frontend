import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormControl, FormsModule } from "@angular/forms";
import { debounceTime, startWith, switchMap } from "rxjs/operators";
import { Product, ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from "../../services/common/toast.service";
import { ProductCardComponent } from "../../components/product-card/product-card.component";

@Component({
  selector: "app-product-catalog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule, ProductCardComponent],
  templateUrl: "./product-catalog.component.html",
  // styleUrls: ["./product-catalog.component.scss"],
  
})
export class ProductCatalogComponent implements OnInit { 
  products: Product[] = [];
  loading = false;
  error = '';

  // Ricerca e filtri
  searchControl = new FormControl('');
  selectedCategory: string | null = '';
  stockFilter: string | null = '';
  categories: { id: number; name: string }[] = [];

  constructor(private productService: ProductService,private cartService:CartService, private toast:ToastService) { }

  ngOnInit(): void {
    // Carica categorie per la select
    this.loadCategories();

    // Sub a ricerca con debounce
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400)
      )
      .subscribe(() => this.fetchProducts());

    // Prima fetch
    this.fetchProducts();
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => (this.categories = []),
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService
      .getProducts(20, 1, this.searchControl.value || '', this.selectedCategory || undefined, this.stockFilter || undefined)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Errore nel caricamento dei prodotti.';
          this.loading = false;
        },
      });
  }

  addToCart(p: Product) {
    this.cartService.add(p.id, 1).subscribe({
      next: () => this.toast.success('Aggiunto!'),
      error: () => this.toast.error('Errore nel carrello'),
    });
  }

  onAddToCart(e: { id: number; qty: number }) {
    this.cartService.add(e.id, e.qty).subscribe({
      next: () => this.toast.success('Aggiunto!'),
      error: () => this.toast.error('Errore nel carrello'),
    });
  }
}

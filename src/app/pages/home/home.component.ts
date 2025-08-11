// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryCarouselComponent } from '../../components/category-carousel/category-carousel.componet';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,CategoryCarouselComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        // Filtra solo quelle in licenza
        const licensed = ['Genoa', 'Atalanta', 'Como', 'Hellas Verona', 'As Roma', 'Bologna'];
        this.categories = cats.filter(c => licensed.includes(c.name));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

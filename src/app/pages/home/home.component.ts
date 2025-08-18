// src/app/pages/home/home.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryCarouselComponent } from '../../components/category-carousel/category-carousel.componet';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,CategoryCarouselComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {}


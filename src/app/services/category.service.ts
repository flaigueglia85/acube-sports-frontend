// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WcCategory {
  id: number;
  name: string;
  image?: { src: string } | null;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<WcCategory[]> {
    return this.http.get<WcCategory[]>(
      '/wp-json/custom/v1/categories',
      { withCredentials: true }
    );
  }
}

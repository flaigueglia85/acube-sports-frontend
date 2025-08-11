import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WcCategory {
  id: number;
  name: string;
  image?: { src: string };
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<WcCategory[]> {
    return this.http.get<WcCategory[]>('/wp-json/wc/v3/products/categories?per_page=100&hide_empty=false', {
      withCredentials: true
    });
  }
}

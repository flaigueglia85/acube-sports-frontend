import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface ProductImage {
  src?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  price_raw?: number;
  images?: ProductImage[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders_allowed: boolean;
  categories?: { id: number; name: string }[]; // ← AGGIUNGI QUESTO
  short_description?: string;
  package_size?: string;
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = '/wp-json/custom/v1';

  constructor(private http: HttpClient) { }

  /**
   * Ritorna la lista prodotti con ricerca, categoria e filtro stock.
   * @param perPage  Quantità per pagina (default 20)
   * @param page     Numero pagina (default 1)
   * @param search   Testo da cercare (nome / SKU / EAN)
   * @param category ID categoria WooCommerce
   * @param stock    'instock' | 'outofstock'
   */
  getProducts(perPage = 20, page = 1, q = '', category?: string, stock?: string) {
    const params: Record<string, string> = {
      per_page: String(perPage),
      page: String(page),
    };
    if (q) params['q'] = q.trim();
    if (category) params['category'] = String(category);
    if (stock) params['stock'] = stock; // 'instock' | 'outofstock'

    return this.http.get<Product[]>('/wp-json/custom/v1/products', {
      params, withCredentials: true
    });
  }

  getCategories() {
    return this.http.get<{ id: number; name: string; image?: { src: string } }[]>('/wp-json/custom/v1/categories', {
      withCredentials: true
    });
  }

  /* altri metodi CRUD o dettagli prodotto in futuro… */
}

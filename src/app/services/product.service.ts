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
  images?: ProductImage[];
  stock_status: 'instock'|'outofstock'|'onbackorder';
  manage_stock: boolean;
  stock_quantity: number|null;
  backorders_allowed: boolean;
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly base = '/wp-json/wc/v3';

  constructor(private http: HttpClient) {}

  /**
   * Ritorna la lista prodotti con ricerca, categoria e filtro stock.
   * @param perPage  Quantità per pagina (default 20)
   * @param page     Numero pagina (default 1)
   * @param search   Testo da cercare (nome / SKU / EAN)
   * @param category ID categoria WooCommerce
   * @param stock    'instock' | 'outofstock'
   */
  getProducts(
    perPage = 20,
    page = 1,
    search = '',
    category?: string,
    stock?: string,
  ): Observable<Product[]> {
    let params = new HttpParams()
      // .set('consumer_key', environment.wooCK)
      // .set('consumer_secret', environment.wooCS)
      .set('per_page', perPage)
      .set('page', page);

    if (search)   params = params.set('search', search);
    if (category) params = params.set('category', category);
    if (stock)    params = params.set('stock_status', stock);

    return this.http.get<Product[]>(`${this.base}/products`, { params });
  }

  /** Elenco categorie pubbliche per la select filtro */
  getCategories(): Observable<Category[]> {
    const params = new HttpParams()
      // .set('consumer_key', environment.wooCK)
      // .set('consumer_secret', environment.wooCS)
      .set('per_page', 100)       // recupera fino a 100 categorie
      .set('hide_empty', 'true'); // mostra solo quelle con prodotti

    return this.http.get<Category[]>(`${this.base}/products/categories`, { params });
  }

  /* altri metodi CRUD o dettagli prodotto in futuro… */
}

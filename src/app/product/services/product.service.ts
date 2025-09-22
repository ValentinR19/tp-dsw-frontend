import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { Product } from '@main-module/app/product/models/classes/product.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  
  constructor(private http: HttpClient) {}
  
  // search(page: number, resultSize?: number, filters?: Partial<Product>): Observable<IPaginated<Product>> {
  //   return this.http.get<IPaginated<Product>>(`${ROOT}/page/${page}`, { params: { results: resultSize, ...filters } });
  // }
  search(page: number, resultSize?: number, filters?: Partial<Product>) {
  const safeFilters = filters ?? {};
  const params: Record<string, string | number | boolean | string[]> = {
    ...(resultSize != null ? { results: resultSize } : {}),...Object.fromEntries(
Object.entries(safeFilters).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : typeof v === 'object' ? JSON.stringify(v) : (v as any)])
    ),
  };

  return this.http.get<IPaginated<Product>>(`${ROOT}/page/${page}`, { params });
}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(ROOT);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${ROOT}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(ROOT, product);
  }

  updateProduct(product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${ROOT}/${product.id}`, product);
  }

  delete(product: Product): Observable<void> {
    return this.http.delete<void>(`${ROOT}/${product.id}`);
  }
}
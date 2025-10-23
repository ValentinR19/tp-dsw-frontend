import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { Product } from '@main-module/app/product/models/classes/product.entity';
import { ProductCategory } from '@main-module/app/product/models/classes/product-category.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/products`;

export type ProductFilters = {
  name?: string;
  description?: string;
  productCategoryId?: number;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
};
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  search(page: number, resultSize?: number, filters?: Partial<Product>): Observable<IPaginated<Product>> {
    return this.http.get<IPaginated<Product>>(`${ROOT}/page/${page}`, { params: { results: resultSize, ...(filters as any) } });
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
    return this.http.put<Product>(`${ROOT}/${product.id}`, product);
  }

  delete(product: Product): Observable<void> {
    return this.http.delete<void>(`${ROOT}/${product.id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductCategory } from '@main-module/app/product/models/classes/product-category.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';
const CATEGORIES_ROOT = `${environment.SERVER_URL}/products/categories`;
@Injectable({
    providedIn: 'root',
})
export class ProductCategoryService {
constructor(private http: HttpClient) {}
getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${CATEGORIES_ROOT}/all`);
  }

}

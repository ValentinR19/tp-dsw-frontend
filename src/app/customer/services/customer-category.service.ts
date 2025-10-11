import { CustomerCategory } from './../models/classes/customer-category.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const CATEGORIES_ROOT = `${environment.SERVER_URL}/customer/categories`;
@Injectable({
  providedIn: 'root',
})
export class CustomerCategoryService {
  constructor(private http: HttpClient) {}
  getCategories(): Observable<CustomerCategory[]> {
    return this.http.get<CustomerCategory[]>(`${CATEGORIES_ROOT}/all`);
  }
}

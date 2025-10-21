import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomerCategory } from '@main-module/app/customer/models/classes/customer-category.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/customers/categories`;
@Injectable({
  providedIn: 'root',
})
export class CustomerCategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<CustomerCategory[]> {
    return this.http.get<CustomerCategory[]>(`${ROOT}/all`);
  }
}

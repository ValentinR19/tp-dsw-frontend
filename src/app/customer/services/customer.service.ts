import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { Customer } from '@main-module/app/customer/models/classes/customer.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/customers`;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  search(page: number, resultSize?: number, filters?: Partial<Customer>): Observable<IPaginated<Customer>> {
    return this.http.get<IPaginated<Customer>>(`${ROOT}/page/${page}`, { params: { results: resultSize, ...filters } });
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(ROOT);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${ROOT}/${id}`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(ROOT, customer);
  }

  updateCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.patch<Customer>(`${ROOT}/${customer.id}`, customer);
  }

  delete(customer: Customer): Observable<void> {
    return this.http.delete<void>(`${ROOT}/${customer.id}`);
  }
}

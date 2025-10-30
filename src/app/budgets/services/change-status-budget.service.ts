import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/budgets`;

@Injectable({
  providedIn: 'root',
})
export class ChangeStatusBudgetService {
  constructor(private readonly http: HttpClient) {}

  authorize(id: number): Observable<Budget> {
    return this.http.put<Budget>(`${ROOT}/${id}/authorize`, {});
  }

  confirm(id: number): Observable<Budget> {
    return this.http.put<Budget>(`${ROOT}/${id}/confirm`, {});
  }

  finalize(id: number): Observable<Budget> {
    return this.http.put<Budget>(`${ROOT}/${id}/finalize`, {});
  }

  revoke(id: number): Observable<Budget> {
    return this.http.put<Budget>(`${ROOT}/${id}/revoke`, {});
  }
}

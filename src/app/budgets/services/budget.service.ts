import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@main-module/environments/environment';

const ROOT = `${environment.SERVER_URL}/budgets`;

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly http: HttpClient = inject(HttpClient);
}

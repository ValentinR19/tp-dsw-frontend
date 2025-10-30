import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BudgetStatusTransition } from '@main-module/app/budgets/models/classes/budget-status-transition.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/budgets/status-transitions`;

@Injectable({
  providedIn: 'root',
})
export class BudgetStatusTransitionService {
  private readonly http: HttpClient = inject(HttpClient);

  findStatusTransitions(budgetId: number): Observable<BudgetStatusTransition[]> {
    return this.http.get<BudgetStatusTransition[]>(`${ROOT}/${budgetId}`);
  }

  findAll(): Observable<BudgetStatusTransition[]> {
    return this.http.get<BudgetStatusTransition[]>(`${ROOT}/all`);
  }
}

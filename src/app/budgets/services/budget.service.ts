import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/budgets`;

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly http: HttpClient = inject(HttpClient);

  search(page: number, results: number, filters?: Partial<Budget>): Observable<IPaginated<Budget>> {
    return this.http.get<IPaginated<Budget>>(`${ROOT}/page/${page}`, { params: { results, ...(filters as any) } });
  }

  /**
   * Obtener un presupuesto por ID
   */
  getById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${ROOT}/${id}`);
  }

  /**
   * Crear un nuevo presupuesto
   */
  create(dto: Budget): Observable<Budget> {
    return this.http.post<Budget>(ROOT, dto);
  }

  /**
   * Actualizar un presupuesto existente
   */
  udpate(id: number, dto: Partial<Budget>): Observable<Budget> {
    return this.http.patch<Budget>(`${ROOT}/${id}`, dto);
  }

  /**
   * Eliminar un presupuesto (borrado lógico)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ROOT}/${id}`);
  }
}

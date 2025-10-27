import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';
import { Budget } from '../models/classes/budget.entity';

const ROOT = `${environment.SERVER_URL}/budgets`;

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly http: HttpClient = inject(HttpClient);

  findAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(ROOT);
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

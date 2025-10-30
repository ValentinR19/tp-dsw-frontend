import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/budgets`;

@Injectable({
  providedIn: 'root',
})
export class BudgetPdfService {
  constructor(private readonly http: HttpClient) {}

  generatePdfVoucher(budgetId: number): Observable<Blob> {
    return this.http.get<Blob>(`${ROOT}/${budgetId}/pdf/voucher`, { responseType: 'blob' as 'json' });
  }
}

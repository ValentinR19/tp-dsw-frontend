import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Informe } from '@main-module/app/permissions/informe/models/classes/informe.entity';
import { environment } from '@main-module/environments/environment';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/permissions/informes`;

@Injectable({
  providedIn: 'root',
})
export class InformeService {
  private readonly http: HttpClient = inject(HttpClient);

  getMenu(): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${ROOT}/for-menu`);
  }

  findAll(): Observable<Informe[]> {
    return this.http.get<Informe[]>(`${ROOT}/all`);
  }
}

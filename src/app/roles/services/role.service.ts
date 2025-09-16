import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role } from '@main-module/app/roles/models/classes/role.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/roles`;
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http: HttpClient = inject(HttpClient);

  findAll(): Observable<Role[]> {
    return this.http.get<Role[]>(ROOT);
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${ROOT}/${id}`);
  }

  create(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(ROOT, role);
  }

  update(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${ROOT}/${id}`, role);
  }
}

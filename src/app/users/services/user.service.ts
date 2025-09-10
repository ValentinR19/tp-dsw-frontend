import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { User } from '@main-module/app/users/models/classes/user.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

const ROOT = `${environment.SERVER_URL}/users`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  search(page: number, resultSize?: number, filters?: Partial<User>): Observable<IPaginated<User>> {
    return this.http.get<IPaginated<User>>(`${ROOT}/page/${page}`, { params: { results: resultSize, ...filters } });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${ROOT}/${id}`);
  }

  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(ROOT, user);
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${ROOT}/${user.id}`, user);
  }

  delete(user: User): Observable<void> {
    return this.http.delete<void>(`${ROOT}/${user.id}`);
  }
}

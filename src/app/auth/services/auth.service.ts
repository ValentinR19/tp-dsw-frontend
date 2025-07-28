import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IAccessToken } from '@auth-module/models/interfaces/access-token.interface';
import { IAppPayload } from '@auth-module/models/interfaces/app-payload.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@main-module/environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedUser = new BehaviorSubject<IAppPayload>({ id: undefined, iss: undefined, username: undefined, fullName: undefined });
  private _authenticationState = new BehaviorSubject(false);
  loggedUser$: Observable<IAppPayload>;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly router: Router = inject(Router);
  private readonly helper: JwtHelperService;

  constructor() {
    this.loggedUser$ = this._loggedUser.asObservable();
    const token = this.accessToken;
    this.loadLoggedUser();

    if (token) {
      const isExpired = this.helper.isTokenExpired(token);
      isExpired ? this.logout() : this._authenticationState.next(true);
    }
  }

  login(loginForm: FormGroup): Observable<IAccessToken> {
    return this.http.post<IAccessToken>(`${environment.SERVER_URL}/auth/login`, loginForm).pipe(
      tap((payload: any) => {
        this.setToken(payload.token);
        const decodedToken = this.helper.decodeToken<IAppPayload>(payload.token);
        this._authenticationState.next(true);
        this.setLoggedUser(decodedToken);
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      }),
    );
  }

  setToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  isLoggedIn(): boolean {
    const token = this.accessToken;
    if (!token || this.helper.isTokenExpired(token)) {
      this._authenticationState.next(false);
      return false;
    }
    this._authenticationState.next(true);
    return true;
  }

  logout() {
    localStorage.clear();
    this._authenticationState.next(false);
    this.router.navigate(['/auth/login']);
  }

  setLoggedUser(user: IAppPayload) {
    localStorage.setItem('logged-user', JSON.stringify(user));
    this._loggedUser.next(user);
  }

  get accessToken(): string {
    return localStorage.getItem('access_token');
  }

  get loggedUser(): IAppPayload {
    return this._loggedUser.value;
  }

  private loadLoggedUser() {
    const userRaw = localStorage.getItem('logged-user');
    if (userRaw) {
      const userObj = JSON.parse(userRaw);
      this.setLoggedUser(userObj);
    }
  }
}

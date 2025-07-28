import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { JWT_OPTIONS } from '@auth0/angular-jwt';
import { routes } from '@main-module/app/app.routes';
import { ErrorInterceptor } from '@main-module/app/core/interceptors/error.interceptor';
import { JwtInterceptor } from '@main-module/app/core/interceptors/jwt.interceptor';
import Material from '@primeng/themes/material';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 7000,
      extendedTimeOut: 700,
    }),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Material,
        options: {
          darkModeSelector: '.dark-mode',
          prefix: 'p',
          cssLayer: false,
        },
      },
    }),
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter,
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
};

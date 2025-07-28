import { Routes } from '@angular/router';
import { LoginComponent } from '@auth-module/views/login/login.component';
import { AppComponent } from '@main-module/app/app.component';

export const Authroutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
    ],
  },
];

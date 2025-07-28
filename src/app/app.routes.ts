import { Routes } from '@angular/router';
import { authGuard } from '@main-module/app/core/guards/auth.guard';
import { AdminLayoutComponent } from '@main-module/app/layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@auth-module/auth.routes').then((m) => m.Authroutes),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@admin-layout-module/admin-layout/admin-layout.routes').then((m) => m.AdminLayoutRoutes),
      },
    ],
  },
];

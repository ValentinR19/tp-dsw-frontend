import { Routes } from '@angular/router';
import { DashboardComponent } from '@main-module/app/dashboard/views/dashboard/dashboard.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'users',
    loadChildren: () => import('@main-module/app/users/users.routes').then((m) => m.routes),
  },
  {
    path: 'roles',
    loadChildren: () => import('@main-module/app/roles/roles.routes').then((m) => m.routes),
  },
];

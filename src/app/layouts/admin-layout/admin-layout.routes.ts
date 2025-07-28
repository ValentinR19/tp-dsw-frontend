import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@main-module/layouts/admin-layout/admin-layout.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
  },
];

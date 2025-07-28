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
];

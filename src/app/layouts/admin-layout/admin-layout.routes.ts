import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/layouts/dashboard/dashboard.component';

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
    path: 'customers',
    loadChildren: () => import('@main-module/app/customer/customer.routes').then((m) => m.routes),
  },
  {
    path: 'roles',
    loadChildren: () => import('@main-module/app/roles/roles.routes').then((m) => m.routes),
  },
  {
    path: 'products',
    loadChildren: () => import('@main-module/app/product/product.routes').then((m) => m.routes),
  },
  {
    path: 'budgets',
    loadChildren: () => import('@main-module/app/budgets/budget.routes').then((m) => m.routes),
  },
];

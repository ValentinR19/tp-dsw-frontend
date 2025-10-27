import { Routes } from '@angular/router';
import { BudgetListComponent } from '@main-module/app/budgets/views/budget-list/budget-list.component';
import { BudgetEditorComponent } from './views/budget-editor/budget-editor.component';

export const routes: Routes = [
  {
    path: '',
    component: BudgetListComponent,
  },
  {
    path: 'new',
    component: BudgetEditorComponent,
  },
  {
    path: ':id',
    component: BudgetEditorComponent,
  },
];

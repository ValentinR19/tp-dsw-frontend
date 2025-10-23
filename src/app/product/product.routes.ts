import { Routes } from '@angular/router';
import { ProductsListComponent } from '@main-module/app/product/views/product-list/product-list.component';
import { ProductEditorComponent } from './views/product-editor/product-editor.component';

export const routes: Routes = [
  {
    path: 'catalog',
    component: ProductsListComponent,
  },
  {
    path: 'new',
    component: ProductEditorComponent,
  },
  {
    path: ':id/edit',
    component: ProductEditorComponent,
  },
];

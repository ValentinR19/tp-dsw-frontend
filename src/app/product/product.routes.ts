import { Routes } from '@angular/router';
import { ProductsListComponent } from '@main-module/app/product/views/product-list/product-list.component';

export const routes: Routes = [{
  path: 'catalog',
  component: ProductsListComponent
}]
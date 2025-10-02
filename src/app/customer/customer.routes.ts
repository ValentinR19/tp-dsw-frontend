import { Routes } from '@angular/router';
import { CustomersListComponent } from '@main-module/app/customer/views/customer-list/customer-list.component';
import { CustomerEditorComponent } from './views/customer-editor/customer-editor.component';

export const routes: Routes = [{
  path: '',
  component: CustomersListComponent
},
{
path: 'new',
component: CustomerEditorComponent
},
{
  path: ':id',
  component: CustomerEditorComponent
}
]
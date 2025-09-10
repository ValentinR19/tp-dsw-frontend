import { Routes } from '@angular/router';
import { UserEditorComponent } from '@main-module/app/users/views/user-editor/user-editor.component';
import { UsersListComponent } from '@main-module/app/users/views/users-list/users-list.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  {
    path: 'new',
    component: UserEditorComponent,
  },
  {
    path: ':id/edit',
    component: UserEditorComponent,
  },
];

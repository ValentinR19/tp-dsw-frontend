import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilters } from '@main-module/app/core/interfaces/filters-primeng.interface';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { DeleteEntityComponent } from '@main-module/app/shared/components/delete-entity/delete-entity.component';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { User } from '@main-module/app/users/models/classes/user.entity';
import { UserService } from '@main-module/app/users/services/user.service';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  providers: [DialogService],
})
export class UsersListComponent {
  user$: Observable<User[]>;
  usersCount: number;
  loading: boolean = false;
  rowsPerPage: number = 10;
  filters: Partial<User>;
  resultSize: number = 10;

  selectedFilters: IFilters;

  tableColumns: ITableColumn[] = [
    { name: 'FirstName', attribute: 'firstName' },
    { name: 'LastName', attribute: 'lastName' },
    { name: 'Username', attribute: 'username' },
    { name: 'Email', attribute: 'email' },
  ];

  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly dialogService: DialogService = inject(DialogService);

  lazyLoadTable(event: LazyLoadEvent) {
    this.loading = true;
    this.filters = {};

    this.selectedFilters = event.filters;

    this.rowsPerPage = event.rows || this.rowsPerPage;

    if (event.filters) {
      for (const key of Object.keys(event.filters)) {
        const filterValue = event.filters[key].value || event.filters[key];
        if (filterValue) {
          this.filters[key] = filterValue;
        }
      }
    }
    const pageNumber = (event.first || 0) / (event.rows || this.rowsPerPage) + 1;

    this.user$ = this.userService.search(pageNumber, this.rowsPerPage, this.filters).pipe(
      tap((response: IPaginated<User>) => {
        this.usersCount = response.count;
      }),
      map((response: IPaginated<User>) => {
        return response.data;
      }),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  create() {
    this.router.navigate(['users/new']);
  }

  update(user: User) {
    this.router.navigate([`users/${user.id}/edit`]);
  }

  delete(user: User) {
    const dialogRef = this.dialogService.open(DeleteEntityComponent, {
      header: 'Eliminar Usuario',
      width: '80%',
      closable: false,
      styleClass: 'dialog-borrar',
      dismissableMask: true,
      modal: true,
      data: {
        object: user,
        objectService: this.userService,
        confirmationMessage: `Are you sure to delete the user ${user.username}`,
        waitMessage: 'Wait for deleting',
        successMessage: 'User deleted successfully',
        errorMessage: 'Error deleting user',
        cancelMessage: 'Cancel deleting',
      },
    });
    dialogRef.onClose.subscribe({
      next: () => {
        this.lazyLoadTable({ first: 0, rows: this.rowsPerPage });
      },
      error: () => {},
    });
  }
}

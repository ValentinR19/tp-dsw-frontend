import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilters } from '@main-module/app/core/interfaces/filters-primeng.interface';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { Customer } from '@main-module/app/customer/models/classes/customer.entity';
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { DeleteEntityComponent } from '@main-module/app/shared/components/delete-entity/delete-entity.component';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
  providers: [DialogService],
})
export class CustomersListComponent {
  customer$: Observable<Customer[]>;
  customersCount: number;
  loading: boolean = false;
  rowsPerPage: number = 10;
  filters: Partial<Customer>;
  resultSize: number = 10;

  selectedFilters: IFilters;

  tableColumns: ITableColumn[] = [
    //{ name: '', attribute: 'status.name', isBadge: true, valueMapper: (v) => v.status },
    { name: 'Código Interno', attribute: 'internalCode' },
    { name: 'Nombre', attribute: 'firstName' },
    { name: 'Apellido', attribute: 'lastName' },
    { name: 'Documento', attribute: 'document' },
    { name: 'Empresa', attribute: 'companyName' },
    { name: 'Categoría', attribute: 'customerCategory.name' },
  ];

  private readonly customerService: CustomerService = inject(CustomerService);
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

    this.customer$ = this.customerService.search(pageNumber, this.rowsPerPage, this.filters).pipe(
      tap((response: IPaginated<Customer>) => {
        this.customersCount = response.count;
      }),
      map((response: IPaginated<Customer>) => {
        return response.data;
      }),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  create() {
    this.router.navigate(['customers/new']);
  }

  update(customer: Customer) {
    this.router.navigate([`customers/${customer.id}/edit`]);
  }

  delete(customer: Customer) {
    const dialogRef = this.dialogService.open(DeleteEntityComponent, {
      header: 'Eliminar Cliente',
      width: '80%',
      closable: false,
      styleClass: 'dialog-borrar',
      dismissableMask: true,
      modal: true,
      data: {
        object: customer,
        objectService: this.customerService,
        confirmationMessage: `¿Está seguro que desea eliminar el cliente ${customer.firstName} ${customer.lastName}?`,
        waitMessage: 'Esperando para eliminar',
        successMessage: 'Cliente eliminado correctamente',
        errorMessage: 'Error borrando al cliente',
        cancelMessage: 'Cancelando borrado',
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

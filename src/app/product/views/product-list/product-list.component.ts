import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFilters } from '@main-module/app/core/interfaces/filters-primeng.interface';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { Product } from '@main-module/app/product/models/classes/product.entity';
import { ProductService } from '@main-module/app/product/services/product.service';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { DeleteEntityComponent } from '@main-module/app/shared/components/delete-entity/delete-entity.component';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-Product-list',
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [DialogService],
})
export class ProductsListComponent {
  product$: Observable<Product[]>;
  productsCount: number;
  loading: boolean = false;
  rowsPerPage: number = 10;
  filters: Partial<Product>;
  resultSize: number = 10;

  selectedFilters: IFilters;

  tableColumns: ITableColumn[] = [
    { name: 'Nombre', attribute: 'name' },
    { name: 'Descripción', attribute: 'description' },
  ];

  private readonly ProductService: ProductService = inject(ProductService);
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

    this.product$ = this.ProductService.search(pageNumber, this.rowsPerPage, this.filters).pipe(
      tap((response: IPaginated<Product>) => {
        this.productsCount = response.count;
      }),
      map((response: IPaginated<Product>) => {
        return response.data;
      }),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  create() {
    this.router.navigate(['products/new']);
  }

  update(product: Product) {
    this.router.navigate([`products/${product.id}/edit`]);
  }

  delete(product: Product) {
    const dialogRef = this.dialogService.open(DeleteEntityComponent, {
      header: 'Eliminar Producto',
      width: '80%',
      closable: false,
      styleClass: 'dialog-borrar',
      dismissableMask: true,
      modal: true,
      data: {
        object: product,
        objectService: this.ProductService,
        confirmationMessage: `¿Está seguro que desea eliminar el producto ${product.name}?`,
        waitMessage: 'Esperando para eliminar',
        successMessage: 'Producto eliminado correctamente',
        errorMessage: 'Error borrando el producto',
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

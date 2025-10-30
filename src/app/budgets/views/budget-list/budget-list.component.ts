import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';
import { BudgetService } from '@main-module/app/budgets/services/budget.service';
import { IFilters } from '@main-module/app/core/interfaces/filters-primeng.interface';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { ITableColumn } from '@main-module/app/shared/interfaces/table-column.interface';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent {
  budget$: Observable<Budget[]>;
  rowsPerPage: number = 10;
  resultSize: number = 10;
  indexOfFirstElements: number = 0;
  count: number;
  loading: boolean = false;
  filters: Partial<Budget>;
  selectedFilters: IFilters;

  budgetColumns: ITableColumn[] = [
    { name: 'Cliente', attribute: 'customer.name' },
    { name: 'Fecha de Creación', attribute: 'createdAt' },
    { name: 'Estado', attribute: 'status.name' },
  ];

  private readonly router: Router = inject(Router);
  private readonly budgetService: BudgetService = inject(BudgetService);

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

    this.budget$ = this.budgetService.search(pageNumber, this.rowsPerPage, this.filters).pipe(
      tap((response: IPaginated<Budget>) => {
        this.count = response.count;
      }),
      map((response: IPaginated<Budget>) => {
        return response.data;
      }),
      catchError((error) => {
        return of([]);
      }),
    );
  }

  onCreateBudget() {
    this.router.navigate(['/budgets/new']);
  }

  onEdit(budget: Budget) {
    this.router.navigate([`/budgets/${budget.id}`]);
  }
}

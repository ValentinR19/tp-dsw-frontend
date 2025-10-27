import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomTableDataComponent } from '@main-module/app/shared/components/custom-table/custom-table.component';
import { Budget } from '../../models/classes/budget.entity';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, CustomTableDataComponent],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.scss',
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = [];
  budgetCounts: number = 0;
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Código' },
    { key: 'customer.name', label: 'Cliente' },
    { key: 'seller.username', label: 'Vendedor' },
    { key: 'total', label: 'Total' },
    { key: 'status.name', label: 'Estado' },
  ];

  constructor(
    private readonly budgetService: BudgetService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchBudgets();
  }

  fetchBudgets() {
    this.budgetService.findAll().subscribe((budgets) => {
      this.budgets = budgets;
      this.budgetCounts = budgets.length;
    });
  }

  create() {
    this.router.navigate(['budgets', 'new']);
  }
}

import { BudgetStatus } from '@main-module/app/budgets/models/classes/budget-status.entity';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';

export class BudgetStatusHistory {
  id: number;
  budget: Budget;
  budgetId: number;
  status: BudgetStatus;
  statusId: number;
  userId: number;
  changedAt: Date;
  isReverted: boolean;
}

import { BudgetStatusHistory } from '@main-module/app/budgets/models/classes/budget-status-history.entity';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';

export class BudgetStatus {
  id: number;
  name: string;
  color: string;
  history: BudgetStatusHistory[];
  budgets: Budget[];
}

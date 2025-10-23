import { BudgetStatus } from '../enums/budget-status.enum';
import { Budget } from './budget.entity';
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

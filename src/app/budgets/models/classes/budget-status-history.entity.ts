import { BudgetStatus } from '../enums/budget-status.enum';
export class BudgetStatusHistory {
    id: number;
    budgetId: number;
    status: BudgetStatus;
    statusId: number;
    userId: number;
    changedAt: Date;
    isReverted: boolean;
}

import { BudgetStatusHistory } from "./budget-status-history.entity";
import { Budget } from "./budget.entity";

export class BudgetStatus {
  id: number;
  name: string;
  color: string;    
  history: BudgetStatusHistory[];
  budgets: Budget[];
}
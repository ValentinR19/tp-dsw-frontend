import { BudgetBilling } from '@main-module/app/budgets/models/classes/budget-billing.entity';
import { BudgetItem } from '@main-module/app/budgets/models/classes/budget-item.entity';
import { BudgetShipping } from '@main-module/app/budgets/models/classes/budget-shipping.entity';
import { BudgetStatusHistory } from '@main-module/app/budgets/models/classes/budget-status-history.entity';
import { Customer } from '@main-module/app/customer/models/classes/customer.entity';
import { Currency } from '@main-module/app/shared/enums/currency.enum';
import { User } from '@main-module/app/users/models/classes/user.entity';

export class Budget {
  id: number;
  code: string;
  saleNumber: string;
  subtotal: number;
  totalDiscount: number;
  totaltax: number;
  total: number;
  customerId: number;
  sellerId: number;
  currencyId: number;
  statusId: number;
  items: BudgetItem[];
  statusHistory: BudgetStatusHistory[];
  seller: User;
  customer: Customer;
  currency: Currency;
  budgetShipping: BudgetShipping;
  budgetBilling: BudgetBilling;
  updatedAt: Date;
  createdAt: Date;
}

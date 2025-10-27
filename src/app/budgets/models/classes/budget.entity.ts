import { Currency } from '@main-module/app/shared/enums/currency.enum';
import { User } from '@main-module/app/users/models/classes/user.entity';
import { Customer } from './../../../customer/models/classes/customer.entity';
import { BudgetBilling } from './budget-billing.entity';
import { BudgetItem } from './budget-item.entity';
import { BudgetShipping } from './budget-shipping.entity';
import { BudgetStatusHistory } from './budget-status-history.entity';
import { BudgetStatus } from './budget-status.entity';
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
  status: BudgetStatus;
  items: BudgetItem[];
  statusHistory: BudgetStatusHistory[];
  seller: User;
  customer: Customer;
  currency: Currency;
  budgetShipping: BudgetShipping;
  budgetBilling: BudgetBilling;
}

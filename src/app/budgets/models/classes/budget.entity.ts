import { User } from '@main-module/app/users/models/classes/user.entity';
import { BudgetStatus } from '../enums/budget-status.enum';
import { BudgetItem } from './budget-item.entity';
import { BudgetStatusHistory } from './budget-status-history.entity';
import { Customer } from 'src/app/customers/models/classes/customer.entity';
import { Currency } from 'src/app/financial/models/classes/currency.entity';
import { BudgetShipping } from './budget-shipping.entity';
import { BudgetBilling } from './budget-billing.entity';
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

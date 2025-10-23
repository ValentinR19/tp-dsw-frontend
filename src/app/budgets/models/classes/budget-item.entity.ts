export class BudgetItem {
  id: number;
  budgetId: number;
  productId: number;
  // no se si deberia agregar el producto o no
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  totalLine: number;
}

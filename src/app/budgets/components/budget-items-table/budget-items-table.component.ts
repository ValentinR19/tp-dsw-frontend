import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-budget-items-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, InputNumberModule],
  templateUrl: './budget-items-table.component.html',
})
export class BudgetItemsTableComponent {
  @Input() items: FormArray;
  @Output() itemsChanged = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();

  removeItem(index: number) {
    this.items.removeAt(index);
    this.itemsChanged.emit();
  }

  updateItemTotal(itemGroup: FormGroup) {
    let { quantity, unitPrice, discountPercent } = itemGroup.getRawValue();
    const subtotal = quantity * unitPrice;

    if (discountPercent < 0) discountPercent = 0;
    if (discountPercent > 100) discountPercent = 100;

    const discount = (subtotal * discountPercent) / 100;
    const totalLine = subtotal - discount;

    itemGroup.patchValue({ discount, totalLine, discountPercent }, { emitEvent: false });
    this.itemsChanged.emit();
  }
}

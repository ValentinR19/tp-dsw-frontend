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

  ngOnInit() {
    console.log('Items received:', this.items);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.itemsChanged.emit();
  }

  updateItemTotal(itemGroup: FormGroup) {
    console.log('Updating item total for', itemGroup.value);
    const { quantity, unitPrice, discount } = itemGroup.value;
    console.log('Unit price:', unitPrice);
    const totalLine = quantity * unitPrice - (discount || 0);
    itemGroup.patchValue({ totalLine }, { emitEvent: false });
    this.itemsChanged.emit();
  }
}

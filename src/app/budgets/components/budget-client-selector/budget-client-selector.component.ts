import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-budget-client-selector',
  standalone: true,
  imports: [CommonModule, SelectModule, FormsModule],
  templateUrl: './budget-client-selector.component.html',
})
export class BudgetClientSelectorComponent implements OnInit {
  @Input() customerId: number | null = null;
  @Output() customerSelected = new EventEmitter<number>();
  customers: any[] = [];

  private readonly customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((res) => {
      this.customers = res.map((c) => ({
        label: `${c.firstName} ${c.lastName}`,
        value: c.id,
      }));
    });
  }

  onSelect(customerId: number) {
    console.log('Selected customer ID:', customerId);
    this.customerSelected.emit(customerId);
  }
}

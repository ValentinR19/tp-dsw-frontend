import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-budget-client-selector',
  standalone: true,
  imports: [CommonModule, SelectModule],
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
    this.customerSelected.emit(customerId);
  }
}

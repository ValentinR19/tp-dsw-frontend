import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-budget-client-selector',
  standalone: true,
  imports: [CommonModule, SelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './budget-client-selector.component.html',
})
export class BudgetClientSelectorComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  customers: any[] = [];

  private readonly customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((res) => {
      this.customers = res;
    });
  }
}

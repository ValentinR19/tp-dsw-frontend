import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersComponent } from 'src/app/features/customer/customer.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomersComponent],
  exports: [CustomersComponent],
})
export class CustomerModule {}

import { Component, OnInit } from '@angular/core';
import { Customer } from '@main-module/app/customer/models/classes/customer.entity';
import { CustomerService } from 'src/app/customer/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  addCustomer() {
    const nuevo: Customer = {
      firstName: 'Juan',
      lastName: 'Pérez',
      companyName: 'MiEmpresa',
      address: 'Calle 123',
      zipCode: '2000',
      typeOfDocument: 'DNI',
      document: '12345678',
      internalCode: 'C-001',
      active: true,
      fullName: 'Juan Perez'
    };

    this.customerService.createCustomer(nuevo).subscribe((res) => {
      this.customers.push(res);
    });
  }
}

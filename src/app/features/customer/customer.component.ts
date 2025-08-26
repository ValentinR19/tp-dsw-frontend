import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(data => {
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
      active: true
    };

    this.customerService.createCustomer(nuevo).subscribe(res => {
      this.customers.push(res);
    });
  }
}

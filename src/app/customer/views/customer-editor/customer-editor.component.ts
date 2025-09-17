import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { Role } from '@main-module/app/roles/models/classes/role.entity';
import { RoleService } from '@main-module/app/roles/services/role.service';
import { Customer } from 'src/app/customer/models/classes/customer.entity';
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-customer-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackButtonComponent , ButtonModule, DividerModule, IftaLabelModule, ToggleSwitchModule, MultiSelectModule],
  templateUrl: './customer-editor.component.html',
  styleUrl: './customer-editor.component.scss',
})

export class CustomerEditorComponent implements OnInit {
  customer: Customer;
  customerForm: FormGroup;
  customerId: number;

   roles: Role[] = [];

  private readonly customerService: CustomerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  private readonly roleService: RoleService = inject(RoleService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly messageService: MessageService = inject(MessageService);


  async ngOnInit(): Promise<void> {
    this.buildForm();
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.customerId = Number(params['id']);
    if (this.customerId) { 
      this.customerService.getCustomerById(this.customerId).subscribe({
        next: (customer: Customer) => {
          this.customer = customer;
          this.customerForm.patchValue(customer);
        },
        error: (error) => {
          this.messageService.showErrorFromDTO(`Error al obtener el cliente ${error}`);
        },
      });
    }
  }

  buildForm() {
    this.customerForm = new FormGroup({
      firstName: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      lastName: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      companyName: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      active: new FormControl<boolean>(true, [Validators.required]),
      roles: new FormControl<Partial<Role[]>>([], [Validators.required]),

    });
  }
 submit(): void {
    this.customerForm.markAllAsTouched();
    if (this.customerForm.invalid) return;

    this.customerId ? this.update() : this.create();
  }
 create() {
    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: (customer: Customer) => {
        this.messageService.showSuccessMessage('Cliente creado correctamente');
        this.router.navigate(['customers']);
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al crear el cliente ${error}`);
      },
    });
  }

    getAllRole() {
    this.roleService.findAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  update() {
    this.customerService.updateCustomer({ id: this.customerId, ...this.customerForm.value }).subscribe({
      next: (customer: Customer) => {
        this.messageService.showSuccessMessage('cliente actualizado correctamente');
        this.router.navigate(['customers']);
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al actualizar el cliente ${error}`);
      },
    });
  }

  close(): void {
    this.router.navigate(['customers']);
  }
}

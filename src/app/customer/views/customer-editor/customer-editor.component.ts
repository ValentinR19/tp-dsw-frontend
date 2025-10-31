import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateCustomerShippingForm, ICustomerForm } from '@main-module/app/customer/models/interfaces/customer-form.interface';
import { CustomerCategoryService } from '@main-module/app/customer/services/customer-category.service';
import { CustomerService } from '@main-module/app/customer/services/customer.service';
import { Role } from '@main-module/app/roles/models/classes/role.entity';
import { RoleService } from '@main-module/app/roles/services/role.service';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom, take } from 'rxjs';
import { Customer } from 'src/app/customer/models/classes/customer.entity';
import { CustomerCategory } from '../../models/classes/customer-category.entity';

@Component({
  selector: 'app-customer-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BackButtonComponent, ButtonModule, DividerModule, IftaLabelModule, ToggleSwitchModule, SelectModule],
  templateUrl: './customer-editor.component.html',
  styleUrl: './customer-editor.component.scss',
})
export class CustomerEditorComponent implements OnInit {
  customer: Customer;
  customerForm: FormGroup;
  customerId: number;
  customerCategories: CustomerCategory[] = [];
  roles: Role[] = [];

  private readonly customerService: CustomerService = inject(CustomerService);
  private readonly router: Router = inject(Router);
  private readonly customerCategoryService: CustomerCategoryService = inject(CustomerCategoryService);
  private readonly roleService: RoleService = inject(RoleService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly location = inject(Location);

  async ngOnInit(): Promise<void> {
    this.loadCategories();
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
    this.customerForm = new FormGroup<ICustomerForm>({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      categoryId: new FormControl(null, [Validators.required]),
      companyName: new FormControl(null, [Validators.minLength(2), Validators.maxLength(100)]),
      gender: new FormControl(null, [Validators.pattern(/^(Hombre|Mujer|Otro)$/)]),
      typeOfDocument: new FormControl(null, [Validators.required, Validators.pattern(/^(DNI|CUIT)$/)]),
      document: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{5,20}$/)]),
      internalCode: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      birthdate: new FormControl(null, [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]),
      customerShipping: new FormGroup<CreateCustomerShippingForm>({
        recipientFirstName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
        recipientLastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
        recipientEmail: new FormControl(null, [Validators.minLength(2), Validators.maxLength(100)]),
        phoneAreaCode: new FormControl(null, [Validators.minLength(2), Validators.maxLength(10)]),
        phoneNumber: new FormControl(null, [Validators.pattern(/^[0-9+\- ]+$/), Validators.minLength(6), Validators.maxLength(20)]),
        alias: new FormControl(null, [Validators.minLength(2), Validators.maxLength(100)]),
        adress: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
        number: new FormControl(null, [Validators.minLength(1), Validators.maxLength(10)]),
        complement: new FormControl(null, [Validators.minLength(1), Validators.maxLength(20)]),
        postalCode: new FormControl(null, [Validators.minLength(3), Validators.maxLength(10)]),
        deliveryInstructions: new FormControl(null, [Validators.maxLength(255)]),
      }),
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
    this.location.back();
  }

  loadCategories(): void {
    this.customerCategoryService.getCategories().subscribe({
      next: (categories: CustomerCategory[]) => {
        this.customerCategories = categories;
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al obtener las categorias de clientes ${error}`);
      },
    });
  }
}

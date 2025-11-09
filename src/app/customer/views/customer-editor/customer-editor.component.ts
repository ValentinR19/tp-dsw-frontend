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
      birthdate: new FormControl(null, [Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),this.adultValidator.bind(this)]),
      customerShipping: new FormGroup<CreateCustomerShippingForm>({
        recipientFirstName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
        recipientLastName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
        recipientEmail: new FormControl(null, [Validators.minLength(2), Validators.maxLength(100)]),
        phoneAreaCode: new FormControl(null, [Validators.minLength(2), Validators.maxLength(10)]),
        phoneNumber: new FormControl(null, [Validators.pattern(/^[0-9+\- ]+$/), Validators.minLength(6), Validators.maxLength(20)]),
        alias: new FormControl(null, [Validators.minLength(2), Validators.maxLength(100)]),
        adress: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
        number: new FormControl(null, [Validators.required,Validators.minLength(1), Validators.maxLength(10)]),
        complement: new FormControl(null, [Validators.minLength(1), Validators.maxLength(20)]),
        postalCode: new FormControl(null, [Validators.minLength(3), Validators.maxLength(10)]),
        deliveryInstructions: new FormControl(null, [Validators.maxLength(255)]),
      }),
    });
  }

    submit(): void {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid) {
      this.showValidationErrors();
      return;
    }

    this.customerId ? this.update() : this.create();
  }

  private showValidationErrors(): void {
    const controls = this.customerForm.controls;
    const shippingControls = (this.customerForm.get('customerShipping') as FormGroup)?.controls;

    // Validaciones de campos principales del cliente
    if (controls['firstName'].errors?.['required']) {
      this.messageService.showErrorMessage('El nombre es obligatorio');
      return;
    }

    if (controls['lastName'].errors?.['required']) {
      this.messageService.showErrorMessage('El apellido es obligatorio');
      return;
    }

    if (controls['companyName'].errors?.['required']) {
      this.messageService.showErrorMessage('La razón social es obligatoria');
      return;
    }

    if (controls['categoryId'].errors?.['required']) {
      this.messageService.showErrorMessage('La categoría del cliente es obligatoria');
      return;
    }

    if (controls['typeOfDocument'].errors?.['required']) {
      this.messageService.showErrorMessage('El tipo de documento es obligatorio');
      return;
    }

    if (controls['document'].errors?.['required']) {
      this.messageService.showErrorMessage('El documento es obligatorio');
      return;
    }

    if (controls['internalCode'].errors?.['required']) {
      this.messageService.showErrorMessage('El código interno es obligatorio');
      return;
    }

    // Validaciones de longitud para campos principales
    if (controls['firstName'].errors?.['minlength'] || controls['lastName'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El nombre y apellido deben tener al menos 2 caracteres');
      return;
    }

    if (controls['firstName'].errors?.['maxlength'] || controls['lastName'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('El nombre y apellido no pueden exceder los 50 caracteres');
      return;
    }

    if (controls['internalCode'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El código interno debe tener al menos 4 caracteres');
      return;
    }

    if (controls['internalCode'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('El código interno no puede exceder los 20 caracteres');
      return;
    }

    // Validaciones de formato
    if (controls['typeOfDocument'].errors?.['pattern']) {
      this.messageService.showErrorMessage('El tipo de documento debe ser DNI o CUIT');
      return;
    }

    if (controls['document'].errors?.['pattern']) {
      this.messageService.showErrorMessage('El formato del documento no es válido');
      return;
    }

      if (controls['birthdate'].errors?.['pattern']) {
    this.messageService.showErrorMessage('El formato de fecha debe ser AAAA-MM-DD');
    return;
    }

      if (controls['birthdate'].errors?.['underage']) {
    this.messageService.showErrorMessage('El cliente debe ser mayor de 18 años');
    return;
    }

     if (controls['birthdate'].errors?.['futureDate']) {
    this.messageService.showErrorMessage('La fecha de nacimiento no puede ser futura');
    return;
    }

    // Validaciones de campos de envío (customerShipping)
    if (shippingControls?.['recipientFirstName'].errors?.['required']) {
      this.messageService.showErrorMessage('El nombre del destinatario es obligatorio');
      return;
    }

    if (shippingControls?.['recipientLastName'].errors?.['required']) {
      this.messageService.showErrorMessage('El apellido del destinatario es obligatorio');
      return;
    }

    if (shippingControls?.['phoneAreaCode'].errors?.['required']) {
      this.messageService.showErrorMessage('El codigo de area es obligatorio');
      return;
    }

    if (shippingControls?.['phoneNumber'].errors?.['required']) {
      this.messageService.showErrorMessage('El numero de telefono es obligatorio');
      return;
    }

    if (shippingControls?.['adress'].errors?.['required']) {
      this.messageService.showErrorMessage('La dirección es obligatoria');
      return;
    }

    if (shippingControls?.['number'].errors?.['required']) {
      this.messageService.showErrorMessage('El numero de calle es obligatorio');
      return;
    }

    if (shippingControls?.['postalCode'].errors?.['required']) {
      this.messageService.showErrorMessage('El codigo postal es obligatorio');
      return;
    }

    // Validaciones de longitud para campos de envío
    if (shippingControls?.['recipientFirstName'].errors?.['minlength'] || shippingControls?.['recipientLastName'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El nombre y apellido del destinatario deben tener al menos 2 caracteres');
      return;
    }

    if (shippingControls?.['recipientFirstName'].errors?.['maxlength'] || shippingControls?.['recipientLastName'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('El nombre y apellido del destinatario no pueden exceder los 50 caracteres');
      return;
    }

    if (shippingControls?.['adress'].errors?.['minlength']) {
      this.messageService.showErrorMessage('La dirección debe tener al menos 2 caracteres');
      return;
    }

    if (shippingControls?.['adress'].errors?.['maxlength']) {
      this.messageService.showErrorMessage('La dirección no puede exceder los 150 caracteres');
      return;
    }

    if (shippingControls?.['number'].errors?.['minlength']) {
    this.messageService.showErrorMessage('El número de calle debe tener al menos 1 carácter');
    return;
  }

  if (shippingControls?.['number'].errors?.['maxlength']) {
    this.messageService.showErrorMessage('El número de calle no puede exceder los 10 caracteres');
    return;
  }

    if (shippingControls?.['phoneNumber'].errors?.['pattern']) {
      this.messageService.showErrorMessage('El formato del teléfono no es válido');
      return;
    }

    if (shippingControls?.['phoneNumber'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El teléfono debe tener al menos 6 caracteres');
      return;
    }

    if (controls['companyName'].errors?.['minlength']) {
      this.messageService.showErrorMessage('La razón social debe tener al menos 2 caracteres');
      return;
    }

    // Validaciones para campos opcionales (solo si tienen valor)
    if (shippingControls?.['recipientEmail'].errors?.['minlength']) {
      this.messageService.showErrorMessage('El email del destinatario debe tener al menos 2 caracteres');
      return;
    }

    // Mensaje genérico si hay otros errores
    this.messageService.showErrorMessage('Por favor, complete todos los campos obligatorios');
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

  //para validar la edad
  private adultValidator(control: FormControl): { [key: string]: any } | null {
  if (!control.value) {
    return null; //por si no quiere ponerlo
  }

  const birthdate = new Date(control.value);
  const today = new Date();

  // Calcular la edad
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  // Ajustar si aún no ha cumplido años este año
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }

  // Verificar si es mayor de 18 años
  if (age < 18) {
    return { underage: true };
  }

  // Verificar que la fecha no sea en el futuro
  if (birthdate > today) {
    return { futureDate: true };
  }

  return null;
}

  getAllRole() {
    this.roleService.findAll().subscribe((roles) => {
      this.roles = roles;
    });
  }

  update() {
    this.customerService.updateCustomer({ id: this.customerId, ...this.customerForm.value }).subscribe({
      next: (customer: Customer) => {
        this.messageService.showSuccessMessage('Cliente actualizado correctamente');
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

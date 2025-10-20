import { FormControl, FormGroup } from '@angular/forms';

export interface CreateCustomerShippingForm {
  recipientFirstName: FormControl<string | null>;
  recipientLastName: FormControl<string | null>;
  recipientEmail: FormControl<string | null>;
  phoneAreaCode: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  alias: FormControl<string | null>;
  adress: FormControl<string | null>;
  number: FormControl<string | null>;
  complement: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  deliveryInstructions: FormControl<string | null>;
}

export interface ICustomerForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  companyName: FormControl<string | null>;
  gender: FormControl<'Hombre' | 'Mujer' | 'Otro' | null>;
  typeOfDocument: FormControl<'DNI' | 'CUIT'>;
  document: FormControl<string>;
  internalCode: FormControl<string>;
  birthdate: FormControl<string | null>;
  categoryId: FormControl<number | null>;
  customerShipping: FormGroup<CreateCustomerShippingForm>;
}

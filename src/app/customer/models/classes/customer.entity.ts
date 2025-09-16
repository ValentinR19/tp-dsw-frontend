export class Customer {
  id?: number; // opcional cuando creás un nuevo customer
  firstName: string;
  lastName: string;
  companyName: string;
  gender?: string; // opcional porque en backend es nullable
  address: string;
  zipCode: string;
  typeOfDocument: string;
  document: string;
  internalCode: string;
  active: boolean;
  // relación con otra entidad

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
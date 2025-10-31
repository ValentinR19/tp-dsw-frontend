export class Customer {
  id?: number;
  firstName: string;
  lastName: string;
  companyName: string;
  gender?: string;
  address: string;
  zipCode: string;
  typeOfDocument: string;
  document: string;
  internalCode: string;
  active: boolean;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

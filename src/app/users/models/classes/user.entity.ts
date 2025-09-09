export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  active: boolean;
  email: string;
  phone: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullNameWithUsername(): string {
    return `${this.fullName} (${this.username})`;
  }
}

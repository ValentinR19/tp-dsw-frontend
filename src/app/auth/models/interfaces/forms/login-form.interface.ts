import { FormControl } from '@angular/forms';

export interface IFormLogin {
  username: FormControl<string>;
  password: FormControl<string>;
}

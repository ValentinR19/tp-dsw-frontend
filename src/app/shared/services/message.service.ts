import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastr: ToastrService) {}

  showSuccessMessage(mensaje: string, header = 'Exito!') {
    this.toastr.success(mensaje, header, { progressBar: true });
  }

  showErrorMessage(mensaje: string, header = 'Error') {
    this.toastr.error(mensaje, header, { progressBar: true });
  }

  showInfoMessage(mensaje: string, header = 'Info') {
    this.toastr.info(mensaje, header);
  }

  showErrorFromDTO(errors: string | string[]) {
    if (Array.isArray(errors)) {
      errors.forEach((error: string) => {
        this.showErrorMessage(error);
      });
    } else {
      this.showErrorMessage(errors);
    }
  }
}

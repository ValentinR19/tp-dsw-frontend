import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IDeleteEntity } from '@main-module/app/shared/interfaces/delete-entity.interface';
import { MessageService } from '@main-module/app/shared/services/message.service';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, of, take } from 'rxjs';

@Component({
  selector: 'app-delete-entity',
  templateUrl: './delete-entity.component.html',
  styleUrls: ['./delete-entity.component.scss'],
  imports: [CommonModule, ButtonModule],
})
export class DeleteEntityComponent implements OnInit {
  object: any;
  objectService: any;
  confirmationMessage: string;
  waitMessage: string;
  successMessage: string;
  errorMessage: string;
  cancelMessage: string;
  viewLoading = false;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const data: IDeleteEntity = this.dialogConfig.data;
    this.object = data.object;
    this.confirmationMessage = data.confirmationMessage;
    this.waitMessage = data.waitMessage;
    this.successMessage = data.successMessage;
    this.errorMessage = data.errorMessage;
    this.cancelMessage = data.cancelMessage;
    this.objectService = data.objectService;
  }

  eliminar() {
    this.objectService
      .delete(this.object)
      .pipe(
        take(1),
        catchError((error) => {
          console.error(error);
          this.messageService.showErrorMessage(this.errorMessage || error);
          return of();
        }),
      )
      .subscribe(() => {
        this.messageService.showSuccessMessage(this.successMessage);
        this.dialogRef.close(true);
      });
  }

  cancelar(): void {
    this.messageService.showInfoMessage(this.cancelMessage);
    this.dialogRef.close();
  }
}

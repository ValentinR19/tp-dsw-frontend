import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface ConfirmationDialogData {
  mensajeConfirmacion?: string;
  mensajeCancelar?: string;
  titulo?: string;
  mensajeAlerta?: string;
  tipoAlerta?: 'warning' | 'danger' | 'info';
  labelConfirmar?: string;
  labelCancelar?: string;
  iconoConfirmar?: string;
  iconoCancelar?: string;
  mostrarBotonCancelar?: boolean;
  severidadConfirmar?: 'success' | 'danger' | 'warning' | 'info';
  detalles?: string;
  accionIrreversible?: boolean;
}

@Component({
  selector: 'app-confirmation-entity',
  imports: [CommonModule, ButtonModule],
  templateUrl: './confirmation-entity.component.html',
  styleUrl: './confirmation-entity.component.scss',
})
export class ConfirmationEntityComponent implements OnInit {
  mensajeConfirmacion: string;
  mensajeCancelar: string;
  titulo: string;
  mensajeAlerta: string;
  tipoAlerta: 'warning' | 'danger' | 'info';
  labelConfirmar: string;
  labelCancelar: string;
  iconoConfirmar: string;
  iconoCancelar: string;
  mostrarBotonCancelar: boolean;
  severidadConfirmar: 'success' | 'danger' | 'warning' | 'info';
  detalles: string;
  accionIrreversible: boolean;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig<ConfirmationDialogData>,
  ) {}

  ngOnInit(): void {
    const data = this.config.data || {};

    this.mensajeConfirmacion = data.mensajeConfirmacion ?? '¿Estás seguro de continuar?';
    this.mensajeCancelar = data.mensajeCancelar ?? 'Acción cancelada.';
    this.titulo = data.titulo ?? '';
    this.mensajeAlerta = data.mensajeAlerta ?? '';
    this.tipoAlerta = data.tipoAlerta ?? 'warning';
    this.labelConfirmar = data.labelConfirmar ?? 'Confirmar';
    this.labelCancelar = data.labelCancelar ?? 'Cancelar';
    this.iconoConfirmar = data.iconoConfirmar ?? '';
    this.iconoCancelar = data.iconoCancelar ?? '';
    this.mostrarBotonCancelar = data.mostrarBotonCancelar ?? true;
    this.severidadConfirmar = data.severidadConfirmar ?? 'success';
    this.detalles = data.detalles ?? '';
    this.accionIrreversible = data.accionIrreversible ?? false;
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  getAlertClass(): string {
    return `alert-${this.tipoAlerta}`;
  }

  getConfirmButtonClass(): string {
    return `p-button-${this.severidadConfirmar}`;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-button',
  imports: [CommonModule],
  template: ` <button class="action-btn pi pi-arrow-left" type="button" label="back"></button> `,
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent {}

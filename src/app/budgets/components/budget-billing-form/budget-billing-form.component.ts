import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-budget-billing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DividerModule],
  templateUrl: './budget-billing-form.component.html',
})
export class BudgetBillingFormComponent {
  @Input({ required: true }) form!: FormGroup;
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-budget-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DividerModule],
  templateUrl: './budget-summary.component.html',
})
export class BudgetSummaryComponent {
  @Input() form: FormGroup;
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { lastValueFrom, take } from 'rxjs';
import { BudgetBillingFormComponent } from '../../components/budget-billing-form/budget-billing-form.component';
import { BudgetItemsTableComponent } from '../../components/budget-items-table/budget-items-table.component';
import { BudgetProductSearchComponent } from '../../components/budget-product-search/budget-product-search.component';
import { BudgetShippingFormComponent } from '../../components/budget-shipping-form/budget-shipping-form.component';
import { BudgetSummaryComponent } from '../../components/budget-summary/budget-summary.component';
import { BudgetService } from '../../services/budget.service';
import { BudgetClientSelectorComponent } from './../../components/budget-client-selector/budget-client-selector.component';

@Component({
  selector: 'app-budget-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    BackButtonComponent,
    BudgetClientSelectorComponent,
    BudgetItemsTableComponent,
    BudgetProductSearchComponent,
    BudgetSummaryComponent,
    BudgetBillingFormComponent,
    BudgetShippingFormComponent,
  ],
  templateUrl: './budget-editor.component.html',
  styleUrl: './budget-editor.component.scss',
})
export class BudgetEditorComponent implements OnInit {
  budgetForm: FormGroup;
  showProductSearch = false;
  budgetId: number | null = null;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly budgetService = inject(BudgetService);
  private readonly messageService = inject(MessageService);

  ngOnInit() {
    this.buildForm();
    this.loadIfEditing();
  }

  private buildForm() {
    this.budgetForm = new FormGroup({
      customerId: new FormControl(null, [Validators.required]),
      sellerId: new FormControl(null),
      currencyId: new FormControl(1),
      subtotal: new FormControl(0),
      totalDiscount: new FormControl(0),
      totalTax: new FormControl(0),
      total: new FormControl(0),
      items: new FormArray([]),
      budgetShipping: new FormGroup({
        address: new FormControl(''),
        cityId: new FormControl(null),
        stateId: new FormControl(null),
        countryId: new FormControl(null),
      }),
      budgetBilling: new FormGroup({
        buyerCompany: new FormControl(''),
        buyerAddress: new FormControl(''),
        buyerTaxId: new FormControl(''),
        shippingCountry: new FormControl(''),
        consigneeCompany: new FormControl(''),
        consigneeAddress: new FormControl(''),
        portDestination: new FormControl(''),
        paymentDescription: new FormControl(''),
      }),
    });
  }

  private async loadIfEditing() {
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.budgetId = Number(params['id']);
    if (this.budgetId) {
      this.budgetService.getById(this.budgetId).subscribe((budget) => {
        this.budgetForm.patchValue(budget);
        const itemsArray = this.budgetForm.get('items') as FormArray;
        (budget.items || []).forEach((i) =>
          itemsArray.push(
            new FormGroup({
              productId: new FormControl(i.productId),
              quantity: new FormControl(i.quantity),
              unitPrice: new FormControl(i.unitPrice),
              discount: new FormControl(i.discount),
              tax: new FormControl(i.tax),
              totalLine: new FormControl(i.totalLine),
            }),
          ),
        );
      });
    }
  }

  onCustomerSelected(customerId: number) {
    console.log('Customer selected:', customerId);
    this.budgetForm.patchValue({ customerId });
  }

  onAddProduct(product: any) {
    console.log('Adding product to budget:', product);
    const items = this.budgetForm.get('items') as FormArray;
    items.push(
      new FormGroup({
        productId: new FormControl(product.id),
        quantity: new FormControl(1),
        unitPrice: new FormControl(product.price.price),
        discount: new FormControl(0),
        tax: new FormControl(0),
        totalLine: new FormControl(product.price.price),
      }),
    );
    this.recalculateTotals();
  }

  onItemsChanged() {
    this.recalculateTotals();
  }

  recalculateTotals() {
    const items = (this.budgetForm.get('items') as FormArray).value;
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const discount = items.reduce((sum, i) => sum + (i.discount || 0), 0);
    const total = subtotal - discount;
    this.budgetForm.patchValue({ subtotal, totalDiscount: discount, total });
  }

  submit() {
    this.budgetForm.markAllAsTouched();

    console.log('Submitting budget form:', this.budgetForm.value);
    if (this.budgetForm.invalid) {
      console.log('Invalid Form:', this.budgetForm);
      return;
      
    }

    const payload = this.budgetForm.value;
    const action = this.budgetId ? this.budgetService.udpate(this.budgetId, payload) : this.budgetService.create(payload);

    action.subscribe({
      next: () => {
        this.messageService.showSuccessMessage('Presupuesto guardado correctamente');
        this.router.navigate(['budgets']);
      },
      error: (err) => this.messageService.showErrorFromDTO(`Error: ${err}`),
    });
  }

  close() {
    this.router.navigate(['budgets']);
  }
}

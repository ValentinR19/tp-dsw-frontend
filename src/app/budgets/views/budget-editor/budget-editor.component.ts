import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom, take } from 'rxjs';
import { BudgetBillingFormComponent } from '../../components/budget-billing-form/budget-billing-form.component';
import { BudgetItemsTableComponent } from '../../components/budget-items-table/budget-items-table.component';
import { BudgetProductSearchComponent } from '../../components/budget-product-search/budget-product-search.component';
import { BudgetShippingFormComponent } from '../../components/budget-shipping-form/budget-shipping-form.component';
import { BudgetSummaryComponent } from '../../components/budget-summary/budget-summary.component';
import { Budget } from '../../models/classes/budget.entity';
import { BudgetService } from '../../services/budget.service';
import { BudgetClientSelectorComponent } from './../../components/budget-client-selector/budget-client-selector.component';
import { ViewChild } from '@angular/core';
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
    BudgetSummaryComponent,
    BudgetBillingFormComponent,
    BudgetShippingFormComponent,
  ],
  templateUrl: './budget-editor.component.html',
  styleUrl: './budget-editor.component.scss',
  providers: [DialogService],
})
export class BudgetEditorComponent implements OnInit {
  budgetForm: FormGroup;
  showProductSearch = false;
  budgetId: number | null = null;

  budget: Budget;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly budgetService = inject(BudgetService);
  private readonly messageService = inject(MessageService);
  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly dialogService: DialogService = inject(DialogService);

  ngOnInit() {
    this.buildForm();
    this.loadIfEditing();

    const itemsArray = this.budgetForm.get('items') as FormArray;
    itemsArray.valueChanges.subscribe(() => this.recalculateTotals());
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
  @ViewChild(BudgetShippingFormComponent) shippingFormComp!: BudgetShippingFormComponent;

private hydrateShippingCascades() {
  const shipping = this.budgetForm.get('budgetShipping') as FormGroup;
  const countryId = shipping.get('countryId')?.value;
  const stateId   = shipping.get('stateId')?.value;

  if (countryId) this.shippingFormComp.onCountryChange();
  if (stateId)   this.shippingFormComp.onStateChange();
}

  private async loadIfEditing() {
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.budgetId = Number(params['id']);
    if (!this.budgetId) return;

    this.budgetService.getById(this.budgetId).subscribe((budget) => {
      this.budget = budget;
      this.budgetForm.patchValue({
        customerId: budget.customerId,
        sellerId: budget.sellerId,
        currencyId: budget.currencyId,
        subtotal: budget.subtotal,
        totalDiscount: budget.totalDiscount,
        totalTax: budget.totalTax,
        total: budget.total,
        budgetShipping: {
          address: budget.budgetShipping?.address ?? '',
          countryId: budget.budgetShipping?.country?.id ?? null,
          stateId:   budget.budgetShipping?.state?.id ?? null,
          cityId:    budget.budgetShipping?.city?.id ?? null,
        },
        budgetBilling: budget.budgetBilling,
      });
        // 1) microtarea
  Promise.resolve().then(() => this.hydrateShippingCascades());
      const itemsArray = this.budgetForm.get('items') as FormArray;
      itemsArray.clear();

      (budget.items || []).forEach((i) => {
        const unitPrice = Number(i.unitPrice) || 0;
        const quantity = Number(i.quantity) || 0;
        const discountPercent = Number(i.discountPercent) || 0;

        const discount = (unitPrice * quantity * discountPercent) / 100;
        const totalLine = unitPrice * quantity - discount;

        const itemGroup = new FormGroup({
          productId: new FormControl(i.productId),
          productName: new FormControl(i.productName),
          quantity: new FormControl(quantity),
          unitPrice: new FormControl({ value: unitPrice, disabled: true }),
          discountPercent: new FormControl(discountPercent),
          discount: new FormControl(discount),
          tax: new FormControl(i.tax ?? 0),
          totalLine: new FormControl(totalLine),
        });

        itemsArray.push(itemGroup);
      });
      this.recalculateTotals();
      this.changeDetector.detectChanges();
    });
  }

  onAddProduct(product: any) {
    const items = this.budgetForm.get('items') as FormArray;
    const unitPrice = product.price?.price ?? 0;

    const newItem = new FormGroup({
      productId: new FormControl(product.id),
      productName: new FormControl(product.name),
      quantity: new FormControl(1),
      unitPrice: new FormControl({ value: unitPrice, disabled: true }),
      discountPercent: new FormControl(0),
      discount: new FormControl(0),
      tax: new FormControl(0),
      totalLine: new FormControl(unitPrice),
    });

    items.push(newItem);
    this.recalculateTotals();
  }

  onItemsChanged() {
    this.recalculateTotals();
  }

  recalculateTotals() {
    const itemsArray = this.budgetForm.get('items') as FormArray;
    const items = itemsArray.getRawValue();

    let subtotal = 0;
    let totalDiscount = 0;
    let total = 0;

    items.forEach((item, index) => {
      const lineSubtotal = item.unitPrice * item.quantity;
      const discount = (lineSubtotal * (item.discountPercent || 0)) / 100;
      const totalLine = lineSubtotal - discount;

      subtotal += lineSubtotal;
      totalDiscount += discount;
      total += totalLine;

      const group = itemsArray.at(index) as FormGroup;
      group.patchValue(
        {
          discount,
          totalLine,
        },
        { emitEvent: false },
      );
    });

    this.budgetForm.patchValue(
      {
        subtotal,
        totalDiscount,
        total,
      },
      { emitEvent: false },
    );
  }

  openProductSearch() {
    const ref = this.dialogService.open(BudgetProductSearchComponent, {
      header: 'Buscar producto',
      width: '80%',
      styleClass: 'modal-body',
      closable: false,
      dismissableMask: true,
      modal: true,
    });

    ref.onClose.subscribe((products) => {
      if (products && products.length > 0) {
        products.forEach((p) => this.onAddProduct(p));
      }
    });
  }
  submit() {
    this.budgetForm.markAllAsTouched();

    if (this.budgetForm.invalid) {
      return;
    }

    const payload = this.budgetForm.getRawValue();
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

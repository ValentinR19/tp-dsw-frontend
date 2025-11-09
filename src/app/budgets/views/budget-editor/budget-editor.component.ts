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
      items: new FormArray([], [Validators.required, Validators.minLength(1)]),

      budgetShipping: new FormGroup({
        address: new FormControl('', [Validators.required, Validators.minLength(5)]),
        cityId: new FormControl(null, [Validators.required]),
        stateId: new FormControl(null, [Validators.required]),
        countryId: new FormControl(null, [Validators.required]),
        email: new FormControl('', [Validators.email]),
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

  private async loadIfEditing() {
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    this.budgetId = Number(params['id']);

    if (!this.budgetId) return;

    this.budgetService.getById(this.budgetId).subscribe({
      next: (budget) => {
        this.budget = budget;

        this.budgetForm.reset();

        // Datos básicos
        this.budgetForm.patchValue({
          customerId: budget.customerId,
          sellerId: budget.sellerId,
          currencyId: budget.currencyId || 1,
          subtotal: budget.subtotal || 0,
          totalDiscount: budget.totalDiscount || 0,
          totalTax: budget.totaltax || 0,
          total: budget.total || 0,
        });

        // Items
        const itemsArray = this.budgetForm.get('items') as FormArray;
        itemsArray.clear();

        if (budget.items && budget.items.length > 0) {
          budget.items.forEach((item) => {
            const itemGroup = new FormGroup({
              productId: new FormControl(item.productId),
              productName: new FormControl(item.productName || 'Producto'),
              quantity: new FormControl(item.quantity || 1),
              unitPrice: new FormControl(item.unitPrice || 0),
              discountPercent: new FormControl(item.discountPercent || 0),
              discount: new FormControl(item.discount || 0),
              tax: new FormControl(item.tax || 0),
              totalLine: new FormControl(item.totalLine || 0),
            });
            itemsArray.push(itemGroup);
          });
        }

        let countryId: number | null = null;
        let stateId: number | null = null;
        let cityId: number | null = null;

        // Shipping
        if (budget.budgetShipping) {
          countryId = this.extractId(budget.budgetShipping.countryId);
          stateId = this.extractId(budget.budgetShipping.stateId);
          cityId = this.extractId(budget.budgetShipping.cityId);

          this.budgetForm.patchValue({
            budgetShipping: {
              address: budget.budgetShipping.address || '',
              email: budget.budgetShipping.email || '',
              countryId: countryId,
              stateId: stateId,
              cityId: cityId,
            }
          });
        }

        setTimeout(() => {
          this.loadShippingNames(countryId, stateId, cityId);
        }, 800);

        // Billing
        if (budget.budgetBilling) {
          this.budgetForm.patchValue({
            budgetBilling: budget.budgetBilling
          });
        }

        this.recalculateTotals();
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.messageService.showErrorFromDTO('Error al cargar el presupuesto');
      }
    });
  }

  private extractId(value: any): number | null {
    if (!value) return null;
    if (typeof value === 'object' && value !== null) return value.id;
    if (typeof value === 'number') return value;
    return null;
  }

  private loadShippingNames(countryId: number | null, stateId: number | null, cityId: number | null): void {
    if (!this.shippingFormComp) {
      setTimeout(() => this.loadShippingNames(countryId, stateId, cityId), 300);
      return;
    }

    if (countryId) {
      this.shippingFormComp.loadAndSelectCountry(countryId);

      if (stateId) {
        setTimeout(() => {
          this.shippingFormComp.loadAndSelectState(stateId);

          if (cityId) {
            setTimeout(() => {
              this.shippingFormComp.loadAndSelectCity(cityId);
            }, 1000);
          }
        }, 800);
      }
    }
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
    this.markAllFormGroupsAsTouched(this.budgetForm);

    if (this.budgetForm.invalid) {
      this.messageService.showErrorMessage('Por favor, complete todos los campos obligatorios');
      return;
    }

    const rawData = this.budgetForm.getRawValue();
    const payload = this.preparePayload(rawData);

    const action = this.budgetId ?
      this.budgetService.update(this.budgetId, payload) :
      this.budgetService.create(payload);

    action.subscribe({
      next: () => {
        this.messageService.showSuccessMessage('Presupuesto guardado correctamente');
        this.router.navigate(['budgets']);
      },
      error: (err) => {
        let errorMessage = 'Error al guardar el presupuesto';
        if (err.status === 500) {
          errorMessage = 'Error interno del servidor. Contacte al administrador.';
        } else if (err.status === 400) {
          errorMessage = 'Datos inválidos. Verifique la información ingresada.';
        }
        this.messageService.showErrorMessage(errorMessage);
      },
    });
  }

  private preparePayload(formData: any): any {
    const payload = JSON.parse(JSON.stringify(formData));

    if (payload.budgetShipping) {
      payload.budgetShipping.countryId = Number(payload.budgetShipping.countryId);
      payload.budgetShipping.stateId = Number(payload.budgetShipping.stateId);
      payload.budgetShipping.cityId = Number(payload.budgetShipping.cityId);
    }

    return this.removeEmptyFields(payload);
  }

  private removeEmptyFields(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeEmptyFields(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = this.removeEmptyFields(value);
        }
        return acc;
      }, {} as any);
    }
    return obj;
  }

  private markAllFormGroupsAsTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFormGroupsAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  close() {
    this.router.navigate(['budgets']);
  }
}

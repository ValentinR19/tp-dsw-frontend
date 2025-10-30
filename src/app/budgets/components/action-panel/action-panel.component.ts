import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetStatusTransition } from '@main-module/app/budgets/models/classes/budget-status-transition.entity';
import { Budget } from '@main-module/app/budgets/models/classes/budget.entity';
import { BudgetPdfService } from '@main-module/app/budgets/services/budget-pdf.service';
import { BudgetStatusTransitionService } from '@main-module/app/budgets/services/budget-status-transition.service';
import { ChangeStatusBudgetService } from '@main-module/app/budgets/services/change-status-budget.service';
import { ConfirmationEntityComponent } from '@shared-module/components/confirmation-entity/confirmation-entity.component';
import { MessageService } from '@shared-module/services/message.service';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';

@Component({
  selector: 'app-action-panel',
  imports: [CommonModule, ButtonModule],
  templateUrl: './action-panel.component.html',
  styleUrl: './action-panel.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPanelComponent {
  budget = input.required<any>();
  @Output() close = new EventEmitter<void>();

  voucherLoading = signal<boolean>(false);
  transitionLoading = signal<string | null>(null);

  readonly budgetId = computed(() => this.budget()?.id ?? null);
  readonly transitions = signal<BudgetStatusTransition[]>([]);
  readonly budgetCode = computed(() => this.budget()?.code ?? null);
  readonly sellerName = computed(() => {
    const budget = this.budget();
    return budget ? `${budget.seller.username}` : '—';
  });
  readonly availableTransitions = computed(() => this.transitions());

  TRANSITION_METHODS = {
    Autorizar: () => this.authorize(),
    Confirmar: () => this.confirm(),
    Finalizar: () => this.finalize(),
    Anular: () => this.revoke(),
  };

  private readonly changeStatusBudgetService: ChangeStatusBudgetService = inject(ChangeStatusBudgetService);
  private readonly budgetStatusTransitionService: BudgetStatusTransitionService = inject(BudgetStatusTransitionService);
  private readonly budgetPdfService: BudgetPdfService = inject(BudgetPdfService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly dialogService: DialogService = inject(DialogService);
  private readonly router: Router = inject(Router);

  constructor() {
    effect(() => {
      const budgetId = this.budget()?.id;
      if (budgetId) {
        this.budgetStatusTransitionService.findStatusTransitions(budgetId).subscribe({
          next: (result) => this.transitions.set(result),
          error: (e) => this.messageService.showErrorMessage(e),
        });
      }
    });
  }

  authorize(): void {
    this.changeStatusBudgetService.authorize(this.budgetId()).subscribe({
      next: () => {},
      error: (e) => {
        this.messageService.showErrorMessage(e);
      },
      complete: () => {
        this.messageService.showSuccessMessage('Budget authorized');
        this.onClosePanel();
      },
    });
  }

  confirm(): void {
    this.changeStatusBudgetService.confirm(this.budgetId()).subscribe({
      next: () => {},
      error: (e) => {
        this.messageService.showErrorMessage(e);
      },
      complete: () => {
        this.messageService.showSuccessMessage('Budget confirmed');
        this.onClosePanel();
      },
    });
  }

  finalize(): void {
    this.changeStatusBudgetService.finalize(this.budgetId()).subscribe({
      next: () => {},
      error: (e) => {
        this.messageService.showErrorMessage(e);
      },
      complete: () => {
        this.messageService.showSuccessMessage('Budget finalized');
        this.onClosePanel();
      },
    });
  }

  revoke(): void {
    this.changeStatusBudgetService.revoke(this.budgetId()).subscribe({
      next: () => {},
      error: (e) => {
        this.messageService.showErrorMessage(e);
      },
      complete: () => {
        this.messageService.showSuccessMessage('Budget revoked');
        this.onClosePanel();
      },
    });
  }

  onClosePanel(): void {
    this.close.emit();
  }

  executeTransition(transitionName: string) {
    this.transitionLoading.set(transitionName);
    const fn = this.TRANSITION_METHODS[transitionName];
    if (!fn) {
      this.messageService.showErrorMessage(`Transición "${transitionName}" no reconocida`);
      return;
    }
    const dialogRef = this.dialogService.open(ConfirmationEntityComponent, {
      header: `${transitionName}`,
      styleClass: 'dialog-confirm',
      width: '30%',
      closable: false,
      dismissableMask: true,
    });
    dialogRef.onClose.pipe(take(1)).subscribe((confirmed: boolean) => {
      confirmed ? fn() : this.messageService.showInfoMessage(`Transición de estado cancelada`);
    });
  }

  generatePdfVoucher(): void {
    this.voucherLoading.set(true);
    this.budgetPdfService.generatePdfVoucher(this.budgetId()).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        window.open(url, '_blank');
        this.voucherLoading.set(false);
      },
      error: (e) => {
        this.messageService.showErrorMessage(e);
        this.voucherLoading.set(false);
      },
    });
  }

  verCliente() {
    this.router.navigate([`/customers/${this.budget().customerId}/detail`]);
  }

  update(budget: Budget) {
    this.router.navigate([`/budgets/${budget.id}`]);
  }
}

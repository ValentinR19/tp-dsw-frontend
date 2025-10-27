import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetBillingFormComponent } from './budget-billing-form.component';

describe('BudgetBillingFormComponent', () => {
  let component: BudgetBillingFormComponent;
  let fixture: ComponentFixture<BudgetBillingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetBillingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetBillingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetShippingFormComponent } from './budget-shipping-form.component';

describe('BudgetShippingFormComponent', () => {
  let component: BudgetShippingFormComponent;
  let fixture: ComponentFixture<BudgetShippingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetShippingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetShippingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

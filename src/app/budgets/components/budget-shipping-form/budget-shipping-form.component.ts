import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { LocationService, Country, State, City } from '../../locations/location.service';

@Component({
  selector: 'app-budget-shipping-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DividerModule],
  templateUrl: './budget-shipping-form.component.html',
})
export class BudgetShippingFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup;

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  private subs: Subscription[] = [];

  constructor(private loc: LocationService) {}

  ngOnInit(): void {
    this.loc.getCountries().subscribe(list => this.countries = list ?? []);

    const sub1 = this.form.get('countryId')!.valueChanges.subscribe(countryId => {
      const cid = countryId != null ? Number(countryId) : null;

      this.form.patchValue({ stateId: null, cityId: null }, { emitEvent: false });
      this.states = [];
      this.cities = [];

      if (cid) {
        this.form.get('stateId')!.enable({ emitEvent: false });
        this.form.get('cityId')!.disable({ emitEvent: false });

        this.loc.getStatesByCountry(cid).subscribe(list => {
          this.states = list ?? [];
          if (this.states.length === 0) {
            this.form.get('stateId')!.disable({ emitEvent: false });
            this.form.get('cityId')!.disable({ emitEvent: false });
          }
        });
      } else {
        this.form.get('stateId')!.disable({ emitEvent: false });
        this.form.get('cityId')!.disable({ emitEvent: false });
      }
    });

    const sub2 = this.form.get('stateId')!.valueChanges.subscribe(stateId => {
      const sid = stateId != null ? Number(stateId) : null;

      this.form.patchValue({ cityId: null }, { emitEvent: false });
      this.cities = [];

      if (sid) {
        this.form.get('cityId')!.enable({ emitEvent: false });

        this.loc.getCitiesByState(sid).subscribe(list => {
          this.cities = list ?? [];
          if (this.cities.length === 0) {
            this.form.get('cityId')!.disable({ emitEvent: false });
          }
        });
      } else {
        this.form.get('cityId')!.disable({ emitEvent: false });
      }
    });

    this.subs.push(sub1, sub2);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
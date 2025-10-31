import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription, of } from 'rxjs';
import { LocationService, Country, State, City } from '../../locations/location.service';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-budget-shipping-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DividerModule, SelectModule, FloatLabelModule],
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
    if (!this.form.get('countryId')?.value) {
      this.form.get('stateId')?.disable({ emitEvent: false });
      this.form.get('cityId')?.disable({ emitEvent: false });
    }
    if (!this.form.get('stateId')?.value) {
      this.form.get('cityId')?.disable({ emitEvent: false });
    }

    const subCountries = this.loc.getCountries().subscribe((list) => (this.countries = list ?? []));

    const subCountry = this.form
      .get('countryId')!
      .valueChanges.pipe(
        tap(() => {
          this.form.patchValue({ stateId: null, cityId: null }, { emitEvent: false });
          this.form.get('stateId')!.disable({ emitEvent: false });
          this.form.get('cityId')!.disable({ emitEvent: false });
          this.states = [];
          this.cities = [];
        }),
        switchMap((countryId) => {
          const cid = countryId != null ? Number(countryId) : null;
          if (!cid) return of([] as State[]);
          return this.loc.getStatesByCountry(cid);
        }),
      )
      .subscribe((states) => {
        this.states = states ?? [];
        if (this.states.length) {
          this.form.get('stateId')!.enable({ emitEvent: false });
        }
      });

    const subState = this.form
      .get('stateId')!
      .valueChanges.pipe(
        tap(() => {
          this.form.patchValue({ cityId: null }, { emitEvent: false });
          this.form.get('cityId')!.disable({ emitEvent: false });
          this.cities = [];
        }),
        switchMap((stateId) => {
          const sid = stateId != null ? Number(stateId) : null;
          if (!sid) return of([] as City[]);
          return this.loc.getCitiesByState(sid);
        }),
      )
      .subscribe((cities) => {
        this.cities = cities ?? [];
        if (this.cities.length) {
          this.form.get('cityId')!.enable({ emitEvent: false });
        }
      });

    this.subs.push(subCountries, subCountry, subState);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}

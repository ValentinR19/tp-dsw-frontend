import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectLazyLoadEvent, SelectModule } from 'primeng/select';
import { City, Country, LocationService, State } from '../../locations/location.service';

@Component({
  selector: 'app-budget-shipping-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DividerModule, SelectModule, FloatLabelModule],
  templateUrl: './budget-shipping-form.component.html',
})
export class BudgetShippingFormComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;

  private readonly loc = inject(LocationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  countryPage = 0;
  statePage = 0;
  cityPage = 0;

  ngOnInit(): void {
    this.disableControl('stateId');
    this.disableControl('cityId');

    this.loadCountriesLazy({ first: 0, last: 0 });
  }

  onCountryChange(): void {
    const countryId = this.form.get('countryId')?.value;
    this.resetStates();
    this.resetCities();

    if (countryId) {
      this.enableControl('stateId');
      this.loadStatesLazy({ first: 0, last: 0 });
    } else {
      this.disableControl('stateId');
      this.disableControl('cityId');
    }
  }

  onStateChange(): void {
    const stateId = this.form.get('stateId')?.value;
    this.resetCities();

    if (stateId) {
      this.enableControl('cityId');
      this.loadCitiesLazy({ first: 0, last: 0 });
    } else {
      this.disableControl('cityId');
    }
  }

  // Lazy load de países
  loadCountriesLazy(event: SelectLazyLoadEvent): void {
    const page = Math.floor((event.last ?? 0) / 10) + 1;
    if (page <= this.countryPage) return;
    this.countryPage = page;

    this.loc
      .getCountries(page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.countries = [...this.countries, ...res.data.filter((c) => !this.countries.some((x) => x.id === c.id))];
        this.cdr.markForCheck();
      });
  }

  // Lazy load de provincias
  loadStatesLazy(event: SelectLazyLoadEvent): void {
    const page = Math.floor((event.last ?? 0) / 10) + 1;
    if (page <= this.statePage) return;
    this.statePage = page;

    const countryId = this.form.get('countryId')?.value;
    if (!countryId) return;

    this.loc
      .getStatesByCountry(countryId, page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.states = [...this.states, ...res.data.filter((s) => !this.states.some((x) => x.id === s.id))];
        this.cdr.markForCheck();
      });
  }

  loadCitiesLazy(event: SelectLazyLoadEvent): void {
    const page = Math.floor((event.last ?? 0) / 10) + 1;
    if (page <= this.cityPage) return;
    this.cityPage = page;

    const stateId = this.form.get('stateId')?.value;
    if (!stateId) return;

    this.loc
      .getCitiesByState(stateId, page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.cities = [...this.cities, ...res.data.filter((c) => !this.cities.some((x) => x.id === c.id))];
        this.cdr.markForCheck();
      });
  }

  private resetStates(): void {
    this.states = [];
    this.statePage = 0;
    this.form.get('stateId')?.reset();
    this.disableControl('stateId');
  }

  private resetCities(): void {
    this.cities = [];
    this.cityPage = 0;
    this.form.get('cityId')?.reset();
    this.disableControl('cityId');
  }

  private enableControl(controlName: string): void {
    const control = this.form.get(controlName);
    if (control?.disabled) control.enable();
  }

  private disableControl(controlName: string): void {
    const control = this.form.get(controlName);
    if (control?.enabled) control.disable();
  }
}

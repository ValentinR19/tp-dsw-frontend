import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectLazyLoadEvent, SelectModule } from 'primeng/select';
import { City, Country, LocationService, State } from '../../locations/location.service';
import { lastValueFrom } from 'rxjs';

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
    this.loadCountriesLazy({ first: 0, last: 0 });
  }

  private isLoadingExistingData = false;

public async loadAndSelectCountry(countryId: number): Promise<void> {
  if (!countryId) return;

  const existingCountry = this.countries.find(c => c.id === countryId);
  if (existingCountry) {

    setTimeout(() => {
      this.form.get('countryId')?.setValue(countryId);
      this.onCountryChange();
    }, 100);
    return;
  }

  try {
    const country = await this.findCountryInAllPages(countryId);
    if (country) {

      setTimeout(() => {
        this.form.get('countryId')?.setValue(countryId);
        this.onCountryChange();
      }, 150);
    } else {

    }
  } catch (error) {
  }
}

private async findCountryInAllPages(countryId: number, startPage: number = 1, maxPages: number = 20): Promise<any> {
  for (let page = startPage; page <= maxPages; page++) {
    try {
      const response = await lastValueFrom(this.loc.getCountries(page));


      // Buscar el país en esta página
      const foundCountry = response.data.find(c => c.id === countryId);
      if (foundCountry) {
        // Actualizar la lista de países con todas las páginas cargadas hasta ahora
        if (page === 1) {
          this.countries = response.data;
        } else {
          // Para tener todos los países cargados, necesitaríamos concatenar todas las páginas
          // Pero por ahora solo actualizamos con la página actual para no sobrecargar
          this.countries = response.data;
        }
        this.cdr.markForCheck();
        return foundCountry;
      }

      // Si es la primera página, inicializar la lista
      if (page === 1) {
        this.countries = response.data;
        this.cdr.markForCheck();
      }

      // Si no hay más páginas, salir
      if (response.data.length === 0) {
        break;
      }

    } catch (error) {
      break;
    }
  }

  return null;
}

  public async loadAndSelectState(stateId: number): Promise<void> {
  if (!stateId) return;

  const countryId = this.form.get('countryId')?.value;
  if (!countryId) {
    setTimeout(() => this.loadAndSelectState(stateId), 200);
    return;
  }


  const existingState = this.states.find(s => s.id === stateId);
  if (existingState) {
    this.onStateChange();
    return;
  }

  this.enableControl('stateId');

  try {
    const state = await this.findStateInAllPages(countryId, stateId);
    if (state) {

      setTimeout(() => {
        this.enableControl('stateId');
        this.form.get('stateId')?.setValue(stateId);
        this.onStateChange();
      }, 100);
    } else {

    }
  } catch (error) {

  }
}

private async findStateInAllPages(countryId: number, stateId: number, startPage: number = 1, maxPages: number = 20): Promise<any> {
  for (let page = startPage; page <= maxPages; page++) {
    try {
      const response = await lastValueFrom(this.loc.getStatesByCountry(countryId, page));


      const foundState = response.data.find(s => s.id === stateId);
      if (foundState) {
        if (page === 1) {
          this.states = response.data;
        } else {
          this.states = response.data;
        }
        this.cdr.markForCheck();
        return foundState;
      }

      if (page === 1) {
        this.states = response.data;
        this.cdr.markForCheck();
      }

      if (response.data.length === 0) {
        break;
      }

    } catch (error) {
      break;
    }
  }

  return null;
}

  public async loadAndSelectCity(cityId: number): Promise<void> {
  if (!cityId) return;

  const stateId = this.form.get('stateId')?.value;
  if (!stateId) {
    setTimeout(() => this.loadAndSelectCity(cityId), 200);
    return;
  }


  const existingCity = this.cities.find(c => c.id === cityId);
  if (existingCity) {

    setTimeout(() => {
      this.form.get('cityId')?.setValue(cityId);
    }, 100);
    return;
  }

  try {
    const city = await this.findCityInAllPages(stateId, cityId);
    if (city) {

      setTimeout(() => {
        this.form.get('cityId')?.setValue(cityId);
      }, 100);
    } else {

    }
  } catch (error) {

  }
}

private async findCityInAllPages(stateId: number, cityId: number, startPage: number = 1, maxPages: number = 20): Promise<any> {
  for (let page = startPage; page <= maxPages; page++) {
    try {
      const response = await lastValueFrom(this.loc.getCitiesByState(stateId, page));


      const foundCity = response.data.find(c => c.id === cityId);
      if (foundCity) {
        if (page === 1) {
          this.cities = response.data;
        } else {
          this.cities = response.data;
        }
        this.cdr.markForCheck();
        return foundCity;
      }

      if (page === 1) {
        this.cities = response.data;
        this.cdr.markForCheck();
      }

      if (response.data.length === 0) {
        break;
      }

    } catch (error) {
      break;
    }
  }

  return null;
}

  onCountryChange(): void {
  // Si estamos cargando datos existentes, no resetear
  if (this.isLoadingExistingData) {
    return;
  }

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
  // Si estamos cargando datos existentes, no resetear
  if (this.isLoadingExistingData) {
    return;
  }

  const stateId = this.form.get('stateId')?.value;
  this.resetCities();

  if (stateId) {
    this.enableControl('cityId');
    this.loadCitiesLazy({ first: 0, last: 0 });
  } else {
    this.disableControl('cityId');
  }
}

  public async loadShippingData(countryId: number, stateId: number, cityId: number): Promise<void> {
  if (!countryId) return;

  this.isLoadingExistingData = true; // ← Activar flag

  try {
    // NO resetear estados y ciudades aquí - ya vienen del backend
    // this.resetStates();  ← REMOVER ESTO
    // this.resetCities(); ← REMOVER ESTO

    // 1. Cargar y seleccionar país
    await this.loadAndSelectCountry(countryId);

    // 2. Si hay estado, cargarlo después de un pequeño delay
    if (stateId) {
      await this.delay(500);
      await this.loadAndSelectState(stateId);

      // 3. Si hay ciudad, cargarla después de otro delay
      if (cityId) {
        await this.delay(500);
        await this.loadAndSelectCity(cityId);
      }
    }

  } catch (error) {
    throw error;
  } finally {
    this.isLoadingExistingData = false; // ← Desactivar flag
  }
}

// Y asegúrate de tener el método delay en la clase:
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
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

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPaginated } from '@main-module/app/core/interfaces/paginated.interface';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

export interface Country {
  id: number;
  name: string;
  iso3?: string;
}
export interface State {
  id: number;
  name: string;
}
export interface City {
  id: number;
  name: string;
}

const ROOT = `${environment.SERVER_URL}/locations`;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http: HttpClient = inject(HttpClient);

  getCountries(page: number): Observable<IPaginated<Country>> {
    return this.http.get<IPaginated<Country>>(`${ROOT}/countries/page/${page}`);
  }

  // Provincias por país
  getStatesByCountry(countryId: number, page: number): Observable<IPaginated<State>> {
    return this.http.get<IPaginated<State>>(`${ROOT}/states/${countryId}/page/${page}`);
  }

  // Ciudades por provincia
  getCitiesByState(stateId: number, page: number): Observable<IPaginated<City>> {
    return this.http.get<IPaginated<City>>(`${ROOT}/cities/${stateId}/page/${page}`);
  }
}

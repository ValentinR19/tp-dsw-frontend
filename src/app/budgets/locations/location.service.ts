// src/app/shared/services/location.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';

export interface Country { id: number; name: string; iso3?: string; }
export interface State   { id: number; name: string; }
export interface City    { id: number; name: string; }

const ROOT_COUNTRIES = `${environment.SERVER_URL}/countries`;
const ROOT_STATES    = `${environment.SERVER_URL}/states`;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http: HttpClient = inject(HttpClient);

  /** Lista de países */
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(ROOT_COUNTRIES);
  }

  /** Provincias/estados por país */
  getStatesByCountry(countryId: number): Observable<State[]> {
    return this.http.get<State[]>(`${ROOT_COUNTRIES}/${countryId}/states`);
  }

  /** Ciudades por provincia/estado */
  getCitiesByState(stateId: number): Observable<City[]> {
    return this.http.get<City[]>(`${ROOT_STATES}/${stateId}/cities`);
  }
}


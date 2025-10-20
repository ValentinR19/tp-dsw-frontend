import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductPrice } from '@main-module/app/product/models/classes/product-price.entity';
import { environment } from '@main-module/environments/environment';
import { Observable } from 'rxjs';
const PRICES_ROOT = `${environment.SERVER_URL}/products/prices`;
@Injectable({
  providedIn: 'root',
})
export class ProductPriceService {
  constructor(private http: HttpClient) {}
  getPrices(): Observable<ProductPrice[]> {
    return this.http.get<ProductPrice[]>(`${PRICES_ROOT}/all`);
  }
}

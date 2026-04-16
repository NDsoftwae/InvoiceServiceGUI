import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { ProductResponse } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${API_BASE_URL}/products`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { InvoiceResponse } from '../models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly http = inject(HttpClient);

  getInvoices(): Observable<InvoiceResponse[]> {
    return this.http.get<InvoiceResponse[]>(`${API_BASE_URL}/invoices`);
  }
}

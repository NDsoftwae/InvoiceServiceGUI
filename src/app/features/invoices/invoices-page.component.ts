import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { InvoiceResponse } from '../../core/models/invoice.models';
import { InvoiceApiService } from '../../core/services/invoice-api.service';

@Component({
  selector: 'app-invoices-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './invoices-page.component.html',
  styleUrl: './invoices-page.component.scss'
})
export class InvoicesPageComponent {
  private readonly api = inject(InvoiceApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly invoices = signal<InvoiceResponse[]>([]);

  readonly filters = this.fb.nonNullable.group({
    startDate: [''],
    endDate: ['']
  });

  readonly filteredInvoices = computed(() => {
    const startDate = this.filters.controls.startDate.value;
    const endDate = this.filters.controls.endDate.value;

    return this.invoices().filter((item) => {
      const date = item.invoice?.invoice_header?.date ?? '';
      if (startDate && date < startDate) {
        return false;
      }
      if (endDate && date > endDate) {
        return false;
      }
      return true;
    });
  });

  readonly totalGross = computed(() =>
    this.filteredInvoices().reduce(
      (sum, item) => sum + Number(item.invoice?.totals?.grand_total ?? 0),
      0
    )
  );

  readonly totalCount = computed(() => this.filteredInvoices().length);

  constructor() {
    this.fetchInvoices();
  }

  refresh(): void {
    this.fetchInvoices();
  }

  private fetchInvoices(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getInvoices()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => this.invoices.set(data),
        error: () => this.error.set('Unable to load invoices from the hosted API.')
      });
  }
}

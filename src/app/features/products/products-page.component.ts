import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProductResponse } from '../../core/models/product.models';
import { ProductApiService } from '../../core/services/product-api.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss'
})
export class ProductsPageComponent {
  private readonly api = inject(ProductApiService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly products = signal<ProductResponse[]>([]);

  readonly filters = this.fb.nonNullable.group({
    sku: [''],
    description: [''],
    size: [''],
    qty: [''],
    price: ['']
  });

  readonly filteredProducts = computed(() => {
    const filters = this.filters.getRawValue();

    return this.products().filter((item) => {
      const product = item.product;
      if (!product) {
        return false;
      }

      const matchesText = (value: string | null | undefined, query: string) =>
        !query || (value ?? '').toLowerCase().includes(query.toLowerCase());

      const qtyValue = filters.qty.trim();
      const priceValue = filters.price.trim();

      return (
        matchesText(product.sku, filters.sku) &&
        matchesText(product.description, filters.description) &&
        matchesText(product.size, filters.size) &&
        (!qtyValue || String(product.qty ?? '').includes(qtyValue)) &&
        (!priceValue || String(product.price ?? '').includes(priceValue))
      );
    });
  });

  constructor() {
    this.fetchProducts();
  }

  refresh(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getProducts()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => this.products.set(data),
        error: () => this.error.set('Unable to load products from the hosted API.')
      });
  }
}

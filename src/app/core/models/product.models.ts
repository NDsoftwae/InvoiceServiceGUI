export interface ProductDocument {
  sku?: string | null;
  description?: string | null;
  size?: string | null;
  qty?: number | null;
  cost?: number | null;
  unitcost?: number | null;
  price?: number | null;
  unitprice?: number | null;
  vat?: number | null;
  hash?: string | null;
}

export interface ProductResponse {
  id: string;
  createdAtUtc: string;
  product: ProductDocument | null;
}

export interface InvoiceParty {
  name?: string | null;
  address?: string | null;
  customer_id?: string | null;
  contact_name?: string | null;
  phone?: string | null;
  email?: string | null;
  vat_number?: string | null;
  company_number?: string | null;
}

export interface InvoiceLineItem {
  code?: string | null;
  description?: string | null;
  quantity?: number | null;
  unit?: string | null;
  unit_price?: number | null;
  vat_rate?: number | null;
  total_inc_vat?: number | null;
  pack_size?: string | null;
  unit_grams?: number | null;
}

export interface InvoiceTotals {
  subtotal?: number | null;
  vat_total?: number | null;
  discount?: number | null;
  grand_total?: number | null;
}

export interface PaymentDetails {
  bank_name?: string | null;
  account_number?: string | null;
  sort_code?: string | null;
  reference?: string | null;
  payment_terms?: string | null;
}

export interface AdditionalInfo {
  notes?: Array<string | null> | null;
}

export interface InvoiceDocument {
  invoice_header?: {
    invoice_number?: string | null;
    date?: string | null;
    seller?: InvoiceParty | null;
    customer?: InvoiceParty | null;
  } | null;
  line_items?: Array<InvoiceLineItem | null> | null;
  totals?: InvoiceTotals | null;
  payment_details?: PaymentDetails | null;
  additional_info?: AdditionalInfo | null;
}

export interface InvoiceResponse {
  id: string;
  createdAtUtc: string;
  invoice: InvoiceDocument | null;
}

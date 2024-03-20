export interface HybridQuoteResponse {
  id?: string;
  operator: string;
  productReferenceId: string | number;
  productRate: string | number;
  description: string;
  additionalDescription: string;
  amount: number;
  coverage: Array<{
    coverageReferenceId?: string | number;
    description: string;
    amount: number | string;
    orderIndex?: number;
    fullDescription?: string;
  }>;
}

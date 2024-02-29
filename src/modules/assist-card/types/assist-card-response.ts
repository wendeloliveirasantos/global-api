import { Cobertura } from "./assist-card-coberturas-response";

export interface AssistCardCotacao {
  CodigoProduto: string;
  Rate: number;
  RateDescription: string;
  departuredate: string;
  returndate: string;
  Minimumdays: number;
  Publishedrate: boolean;
  IsTTRModality: boolean;
  PrepayRate: boolean;
  FamilyPlan: boolean;
  Amount: number;
  Quotation: number;
  AssistanceAmount: number;
  IssuanceAmount: number;
  Exchange: number;
  HasMultiplus: boolean;
  MultiplusPoints: number;
  Modality: string;
  IsAnucalQuotation: boolean;
  DmhoCurrency: string;
  DmhoAmount: string;
  PaxMaxAge: number;
  Discount: number;
  Markup: number;
  Coberturas: Cobertura[];
}


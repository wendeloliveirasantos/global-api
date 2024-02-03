export interface AssistCardCoberturasResponse {
  ComparativoCoberturaId: number;
  Coberturas: Cobertura[];
}

export interface Cobertura {
  CoberturaId: number;
  CodigoCobertura: string;
  CodigoTarifa: number;
  Titulo: string;
  Conteudo: string;
  Valor: string;
}
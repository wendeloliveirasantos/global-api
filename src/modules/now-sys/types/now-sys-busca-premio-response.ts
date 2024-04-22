export interface NowSysBuscaPremioResponse {
  coberturas: Coberturas[];
}

export interface Coberturas {
  codigo: string;
  nome: string;
  premio: Premio;
}

export interface Premio {
  importanciaSegurada: string;
  valor_premio_liquido: number;
  valor_iof: number;
  valor_premio_comercial: number;
}
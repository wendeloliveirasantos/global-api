export interface NowSysCotacao {
  codigo: string;
  nome: string;
  ramo: {
    codigoRamoSUSEP: string;
    nome: string;
  };
  motorCalculo: MotorCalculo;
  coberturas: Cobertura[];
  assistencias: Assistencia[];
  clausulas: string[];
  representacao: string[];
  formasPagamento: FormaPagamento[];
  codigoComercial: string;
}

export interface FaixaImportanciaSegurada {
  importanciaSegurada: string;
  premioTarifario: number;
  premioTotal: number;
  fatorTarifario: number;
  franquia: string;
}

export interface Cobertura {
  codigo: string;
  nome: string;
  premio: {
    faixasImportanciaSegurada: FaixaImportanciaSegurada[];
  };
}

export interface Assistencia {
  fornecedor: string;
  nome: string;
  codigo: string;
  valorCusto: number;
  importanciasegurada: number;
}

export interface MotorCalculo {
  api_calculo: string;
  tipo: string;
  ParametrosAgravamento: string[];
}

export interface FormaPagamento {
  operador: string;
  produto: string;
  linkCobranca: string;
  tipoPagamento: string[];
  recursividade: number[];
}
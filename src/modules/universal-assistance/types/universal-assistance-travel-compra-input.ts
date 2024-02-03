export interface UniversalAssistanceTravelDadosBasicos {
  destinos: string[];
  tipoViagem?: number;
  tipoTarifa?: number;
  dataSaida: string;
  dataRetorno: string;
  valorCompra: number;
  formaPagamento: number;
  nomeContatoBrasil: string;
  telefoneContatoBrasil: string;
}

export interface UniversalAssistanceTravelDadosTitular {
  codigo: number;
  nome: string;
  sobrenome: string;
  documento: string;
  tipoDocumento: number;
  telefone: string;
  endereco: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  dataNascimento: string;
  uf: string;
}

export interface UniversalAssistanceTravelDadosProdutos {
  codigoProduto: number;
  valorProduto: number;
  codigoPeriodoMultiViagem?: number;
  codigoTarifaAcordo?: number;
}

export interface UniversalAssistanceTravelDadosPagamento {
  codigoOperadora?: number;
  nomeTitularCartao?: string;
  cpfTitular?: string;
  numeroCartao?: string;
  codigoSeguranca?: string;
  mesValidade?: string;
  anoValidade?: string;
  parcelas?: number;
}

export interface UniversalAssistanceTravelObjetoViagem {
  dadosBasicos: UniversalAssistanceTravelDadosBasicos;
  dadosTitular: UniversalAssistanceTravelDadosTitular;
  dadosIntegrantes: any[]; // Preencher com o tipo correto, se necessário
  dadosProdutos: UniversalAssistanceTravelDadosProdutos;
  dadosPagamento: UniversalAssistanceTravelDadosPagamento;
}

export interface UniversalAssistanceTravelDadosBasicosControllerInput
  extends Omit<
    UniversalAssistanceTravelDadosBasicos,
    'tipoTarifa' | 'tipoViagem'
  > {}

export interface UniversalAssistanceTravelObjetoViagemControllerInput
  extends UniversalAssistanceTravelObjetoViagem {
  dadosBasicos: UniversalAssistanceTravelDadosBasicosControllerInput;
}

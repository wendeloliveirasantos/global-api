export interface Proposta {
  dados_proposta: DadosProposta[];
  segurado: Segurado;
  //item_segurado: ItemSegurado[];
  cobranca: Cobranca;
}

export interface DadosProposta {
  produto: Produto;
  data_base_calculo: string;
  vigencia: Vigencia;
  dtemissao: string;
  nrproposta: string;
  estipulante: string;
  propostaid: number;
  dtrecepcao: string;
  situacao: string;
}

export interface Produto {
  codigo_produto: string;
}

export interface Vigencia {
  data_inicio: string;
  data_fim: string;
}

export interface Segurado {
  nome: string;
  cpf_cnpj: string;
  endereco: Endereco;
  contato: Contato[];
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  siglaestado: string;
  cep: string;
}

export interface Contato {
  tipo: string;
  descricao: string;
}

export interface ItemSegurado {
  identificacao: string;
  descricao: string;
  vigencia: Vigencia;
  caracteristicas: Caracteristicas;
}

export interface Caracteristicas {
  basico: Basico;
  enquadramento: Enquadramento;
}

export interface Basico {
  atividade: string[];
}

export interface Enquadramento {
  local_de_risco: LocalDeRisco;
  sexo: string;
  idade: string;
  utilizacao: string;
  birthday: string;
  marital_status: string;
  garage: string;
  alienado: string;
  desconto: number;
}

export interface LocalDeRisco {
  cep: string;
  descricao: string;
}

export interface Cobranca {
  tipocobranca: string;
  cliente_id: string;
  token_card: string;
  pagamento_id: string;
  fatura_id: string;
  url_fatura: string;
  assinatura_id: string;
  operadora_cobranca: OperadoraCobranca;
  //parcelas_cobradas: ParcelasCobradas;
}

export interface OperadoraCobranca {
  nome: string;
}

export interface ParcelasCobradas {
  dtvencimento: string;
  dtrecebido: string;
  valorparcela: number;
  valor_recebido: number;
  identificacao: string;
}
export interface PurchasesResponse {
  seguradora: string;
  codigoProduto: string;
  nomeProduto: string;
  dataInicio: string;
  dataFim: string;
  dataEmissao: string;
  numeroProposta: string;
  valorPremio: string;
  segurado: Segurado;
}

export interface Segurado {
  nome: string;
  cpfCnpj: string;
  endereco: Endereco;
  contato: Contato[];
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Contato {
  tipo: string;
  descricao: string;
}
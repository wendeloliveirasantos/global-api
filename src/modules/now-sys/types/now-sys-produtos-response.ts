export interface NowSysProdutosResponse {
  status: string;
  items: Produto[];
}

export interface Produto {
  codigo: string;
  nome: string;
}
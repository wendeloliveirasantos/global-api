export interface Beneficio {
  descricao: string;
  descricaoCompleta: string;
  idBeneficio: number;
  imagem: string | null;
  ordem: number;
  tipoBeneficio: number;
  apelido: string | null;
  categoriaBeneficio: number;
  valor?: string;
  valorEmDinheiro?: number;
}

export interface Passageiro {
  beneficiarios: any[] | null;
  dataEmissaoDocumento: string | null;
  dataNascimento: string;
  desconto: number;
  idPassageiro: number;
  nome: string | null;
  numeroDocumento: string | null;
  origemDocumento: string | null;
  sexo: string | null;
  sobrenome: string | null;
  tipoDocumento: number;
  codigo: number;
}

export interface TarifaIdade {
  de: number;
  ate: number;
  valor: number;
  valorMoeda: number;
}

export interface Tarifa {
  aplicaDescontoPadrao: boolean;
  aplicaPromocao: boolean;
  cambio: number;
  comissao: number;
  desconto: number;
  quantidadeDias: number;
  quantidadeDiasMultiviagem: number;
  quantidadeFree: number;
  quantidadePassageiros: number;
  tarifaFolheto: boolean;
  tarifaIdade: TarifaIdade[];
  valor: number;
  valorFolheto: number;
  valorFolhetoMoeda: number;
  valorMoeda: number;
  valorSemDesconto: number;
  valorUnitario: number;
  valorUnitarioMoeda: number;
  descontoCupom: number;
  valorSemDescontoBRL: number;
  valorSemDescontoMoeda: number;
}

export interface RegraCancelamento {
  de: string;
  ate: string;
  geraCredito: boolean;
  multa: number;
}

export interface Produto {
  avulso: boolean;
  beneficios: Beneficio[];
  beneficiosOpcionais: any[]; // Você pode adicionar tipagem aqui se souber a estrutura dos benefícios opcionais.
  codigoAgrupador: any | null;
  cupoms: any | null;
  dataInicioVigenciaBeneficio: string;
  descontoPadrao: number;
  descricao: string;
  fkCupom: any | null;
  idBeneficioDestaque: number;
  idProduto: number;
  idProdutoAcordo: number;
  idProdutoDesconto: number;
  limitaQuantidadePelaAssistencia: boolean;
  pontuacao: any | null;
  tarifa: Tarifa;
  tarifas: any[]; // Você pode adicionar tipagem aqui se souber a estrutura das tarifas.
  rank: number;
  idadeMinima: number;
  idadeMaxima: number;
  minimo1PaxComIdadeMaiorIgual: number;
  simboloMoeda: string;
  idVigenciaBeneficioProduto: number;
  idProdutoDescontoPadrao: any | null;
  idProdutoCambioCongelado: any | null;
  melhorEscolha: any | null;
  internacional: boolean;
  multiviagem: boolean;
  urlLogoEmpresa: any | null;
  regraCancelamento: RegraCancelamento[];
  descricaoAdicional: string;
  diasMultiviagem: number;
  maxParcelas: number;
  quotationRuleName: any | null;
  quotationPorcentagemVenda: number;
  markup: any | null;
  quotationPorcentagemPremio: number;
}

export interface UniversalAssistanceTravelCotacao {
  beneficios: Beneficio[];
  codigoOperacao: any | null;
  dataCotacao: string;
  dataFinal: string;
  dataInicial: string;
  destinosCotacao: any[]; // Você pode adicionar tipagem aqui se souber a estrutura dos destinos.
  diasViagem: number;
  emailEmpresa: any | null;
  empresa: string;
  logo: any | null;
  mensagemCupom: any | null;
  mostraSomenteReaisNoWhiteLabel: any | null;
  mostrarTarifaAcordo: boolean;
  passageiros: Passageiro[];
  produtos: Produto[];
  produtosAutomaticos: any[]; // Você pode adicionar tipagem aqui se souber a estrutura dos produtos automáticos.
  telefoneEmpresa: string;
  tipoTarifaFolheto: string;
  tipoViagem: number;
  codigoEmpresa: number;
  codigoEmissor: number;
  valorDoCambio: number;
  emiteFaturadoW: any | null;
  emiteAcordoW: any | null;
  somenteCotacao: any | null;
  emiteFaturadoC: any | null;
  emiteCartaoC: any | null;
  emiteBoletoC: any | null;
  urlLogoEmpresa: any | null;
  canalDeVenda: number;
}

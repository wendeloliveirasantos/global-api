export interface UniversalAssistanceTravelCotacaoInput {
  destinos: Array<string>;
  passageiros: Array<{
    dataNascimento: string;
  }>;
  tipoTarifa: number;
  tipoViagem: number;
  dataSaida: string;
  dataRetorno: string;
}

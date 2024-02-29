import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map, tap } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { AssistCardCompraInput } from './types/assist-card-compra-input';
import { AssistCardCotacaoInput } from './types/assist-card-cotacao';
import { AssistCardCotacao } from './types/assist-card-response';
import { AssistCardCoberturasInput } from './types/assist-card-coberturas-input';
import { AssistCardCoberturasResponse } from './types/assist-card-coberturas-response';
import { AssistCardTokenInput } from './types/assist-card-token-input';
import { AssistCardTokenResponse } from './types/assist-card-token-response';

@Injectable()
export class AssistCardService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(AssistCardService.name);

  autenticacao(): Observable<AssistCardTokenResponse> {
    const {
      assistCardUrl,
      assistCardLogin,
      assistCardSenha
    } = this.getConfig();

    const headers = {
    };

    const input: AssistCardTokenInput = {
      agencycode: assistCardLogin,
      password: assistCardSenha
    };

    const url = assistCardUrl + '/APIjson/Autenticacao';
    
    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error({ input, error });
        throw new ForbiddenException(
          'Assist Card not available to purchase',
        );
      }),
    );
  }

  cotacao(
    dto: AssistCardCotacaoInput,
  ): Observable<AssistCardCotacao[]> {
    const {
      assistCardUrl
    } = this.getConfig();

    const headers = {
    };

    const input: AssistCardCotacaoInput = {
      ...dto
    };

    const url = assistCardUrl + '/APIjson/Cotacao';

    return this.httpService
      .post(url, input, {
        headers,
      })
      .pipe(
        map((res) => {
          var produtos = res.data as AssistCardCotacao[];
          produtos.forEach((p) => {
            p.departuredate = dto.departuredate;
            p.returndate = dto.returndate;
            p.Coberturas = [];
            p.Coberturas.push(
              {
                CoberturaId: 0,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas médicas e hospitalares",
                Conteudo: "",
                Valor: "$" + p.DmhoAmount
              },
              {
                CoberturaId: 1,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas médicas por covid-19",
                Conteudo: "",
                Valor: "$30.000"
              },
              {
                CoberturaId: 2,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Cancelamento de viagem",
                Conteudo: "",
                Valor: "$2.000"
              },
              {
                CoberturaId: 3,
                CodigoCobertura: "BS010",
                CodigoTarifa: p.Rate,
                Titulo: "Regresso Sanitário:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 4,
                CodigoCobertura: "BS014",
                CodigoTarifa: p.Rate,
                Titulo: "Regresso de Menores e Maiores:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 5,
                CodigoCobertura: "BS018",
                CodigoTarifa: p.Rate,
                Titulo: "Traslado de um familiar:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 6,
                CodigoCobertura: "BS022",
                CodigoTarifa: p.Rate,
                Titulo: "Hospedagem de acompanhante:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 7,
                CodigoCobertura: "BS026",
                CodigoTarifa: p.Rate,
                Titulo: "Prorrogaçao de estadia:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 8,
                CodigoCobertura: "BS038",
                CodigoTarifa: p.Rate,
                Titulo: "Assistência em caso de roubo, furto ou extravio de documentos, etc:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 9,
                CodigoCobertura: "BS042",
                CodigoTarifa: p.Rate,
                Titulo: "Retorno antecipado por sinistro grave na residência:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 10,
                CodigoCobertura: "BS046",
                CodigoTarifa: p.Rate,
                Titulo: "Traslado de Corpo:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 11,
                CodigoCobertura: "BS050",
                CodigoTarifa: p.Rate,
                Titulo: "Localização de bagagens:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 12,
                CodigoCobertura: "BS054",
                CodigoTarifa: p.Rate,
                Titulo: "Assistência legal por responsabilidade em um acidente:\n\n",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 13,
                CodigoCobertura: "BS001",
                CodigoTarifa: p.Rate,
                Titulo: "Coordenação dos seguintes serviços: (por conta e ordem da ASSIST CARD Smalline Corp. S/A.):\n",
                Conteudo: "",
                Valor: "SIM"
              },
              {
                CoberturaId: 14,
                CodigoCobertura: "B0006",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas Odontológicas em Viagem ao Exterior (DO em Viagem ao Exterior)",
                Conteudo: "EUROPA EUR 700/ RESTO DO MUNDO USD 700",
                Valor: "$700"
              },
              {
                CoberturaId: 15,
                CodigoCobertura: "B0009",
                CodigoTarifa: p.Rate,
                Titulo: "Morte Acidental em Viagem (Até 70 anos):",
                Conteudo: "EUROPA EUR 30.000/ RESTO DO MUNDO USD 30.000",
                Valor: "$30.000"
              },
              {
                CoberturaId: 16,
                CodigoCobertura: "B0010",
                CodigoTarifa: p.Rate,
                Titulo: "Invalidez Permanente Total ou Parcial por Acidente em Viagem",
                Conteudo: "EUROPA EUR 20.000/ RESTO DO MUNDO USD 20.000",
                Valor: "$20.000"
              },
              {
                CoberturaId: 17,
                CodigoCobertura: "B0012",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas com Medicamentos",
                Conteudo: "EUROPA EUR 1.000/ RESTO DO MUNDO USD 1.000",
                Valor: "$1.000"
              },
              {
                CoberturaId: 18,
                CodigoCobertura: "B0013",
                CodigoTarifa: p.Rate,
                Titulo: "Reembolso por Atraso de embarque",
                Conteudo: "EUROPA EUR 100/ RESTO DO MUNDO USD 100",
                Valor: "$100"
              },
              {
                CoberturaId: 19,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Seguro Bagagem Plus em Viagem ao Exterior - Franquia: 96 hs de atraso (**)",
                Conteudo: "EUROPA EUR 1.200 / RESTO DO MUNDO USD 1.200",
                Valor: "$1.200"
              },
              {
                CoberturaId: 20,
                CodigoCobertura: "B0019",
                CodigoTarifa: p.Rate,
                Titulo: "Reembolso por atraso de bagagem",
                Conteudo: "EUROPA EUR 200 (mais de 8hs) / RESTO DO MUNDO USD 200 (mais de 8hs)",
                Valor: "$200"
              },
              {
                CoberturaId: 21,
                CodigoCobertura: "B0020",
                CodigoTarifa: p.Rate,
                Titulo: "Traslado de Corpo",
                Conteudo: "EUROPA EUR 30.000/ RESTO DO MUNDO USD 30.000",
                Valor: "$30.000"
              },
              {
                CoberturaId: 22,
                CodigoCobertura: "B0022",
                CodigoTarifa: p.Rate,
                Titulo: "Regresso Sanitário",
                Conteudo: "EUROPA EUR 100.000/ RESTO DO MUNDO USD 100.000",
                Valor: "$100.000"
              },
              {
                CoberturaId: 23,
                CodigoCobertura: "B0026",
                CodigoTarifa: p.Rate,
                Titulo: "Traslado Medico",
                Conteudo: "EUROPA EUR 10.000/ RESTO DO MUNDO USD 10.000",
                Valor: "$10.000"
              },
              {
                CoberturaId: 24,
                CodigoCobertura: "B0050",
                CodigoTarifa: p.Rate,
                Titulo: "Retorno do Segurado:\n",
                Conteudo: "EUROPA EUR 1.200/ RESTO DO MUNDO USD 1.200",
                Valor: "$1.200"
              },
              {
                CoberturaId: 25,
                CodigoCobertura: "B0082",
                CodigoTarifa: p.Rate,
                Titulo: "Prorrogação de estadia",
                Conteudo: "EUROPA EUR 1.100/ RESTO DO MUNDO USD 1.100",
                Valor: "$1.100"
              },
              {
                CoberturaId: 26,
                CodigoCobertura: "B0070",
                CodigoTarifa: p.Rate,
                Titulo: "Hospedagem de acompanhante",
                Conteudo: "EUROPA EUR 500/ RESTO DO MUNDO USD 500",
                Valor: "$500"
              },
              {
                CoberturaId: 27,
                CodigoCobertura: "B0062",
                CodigoTarifa: p.Rate,
                Titulo: "Retorno de acompanhante",
                Conteudo: "EUROPA EUR 1.200/ RESTO DO MUNDO USD 1.200",
                Valor: "$1.200"
              },
              {
                CoberturaId: 28,
                CodigoCobertura: "B0074",
                CodigoTarifa: p.Rate,
                Titulo: "Regresso de Menores e Maiores:",
                Conteudo: "EUROPA EUR 1.200/ RESTO DO MUNDO USD 1.200",
                Valor: "$1.200"
              },
              {
                CoberturaId: 29,
                CodigoCobertura: "B0086",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas jurídicas em viagem",
                Conteudo: "EUROPA EUR 4.000/ RESTO DO MUNDO USD 4.000",
                Valor: "$4.000"
              },
              {
                CoberturaId: 30,
                CodigoCobertura: "B0090",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas com fiança e despesas legais em viagem\n\n",
                Conteudo: "EUROPA EUR 4.000/ RESTO DO MUNDO USD 4.000",
                Valor: "$4.000"
              },
              {
                CoberturaId: 31,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Danos a Malas",
                Conteudo: "EUROPA EUR 50 / RESTO DO MUNDO USD 50 ",
                Valor: "$50"
              },
              {
                CoberturaId: 32,
                CodigoCobertura: "B0048",
                CodigoTarifa: p.Rate,
                Titulo: "Interrupção de Viagem por Múltiplos Motivos",
                Conteudo: "EUROPA EUR 500/ RESTO DO MUNDO USD 500",
                Valor: "$500"
              },
              {
                CoberturaId: 33,
                CodigoCobertura: "BS002",
                CodigoTarifa: p.Rate,
                Titulo: "Assistência médica:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              },
              {
                CoberturaId: 34,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Mala, Bolsa e Mochila Protegida (Franquia de 20%)\n",
                Conteudo: "EUROPA EUR 500 / RESTO DO MUNDO USD 500 ",
                Valor: "$500"
              },
              {
                CoberturaId: 35,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Compra protegida – Plano D (Franquia de 15%)\n",
                Conteudo: "EUROPA EUR 500 / RESTO DO MUNDO USD 500",
                Valor: "$500"
              },
              {
                CoberturaId: 36,
                CodigoCobertura: "",
                CodigoTarifa: p.Rate,
                Titulo: "Despesas com “Pet”",
                Conteudo: "EUROPA EUR 200 / RESTO DO MUNDO USD 200 ",
                Valor: "$200"
              },
              {
                CoberturaId: 37,
                CodigoCobertura: "BG001",
                CodigoTarifa: p.Rate,
                Titulo: "VALIDADE TERRITORIAL:",
                Conteudo: "INTERNACIONAL (EXCETO EUA\n",
                Valor: "SIM"
              },
              {
                CoberturaId: 38,
                CodigoCobertura: "BG004",
                CodigoTarifa: p.Rate,
                Titulo: "LIMITAÇÕES E EXCLUSÕES ESPECIAIS POR IDADE:",
                Conteudo: "PRODUTO VALIDO SOMENTE PARA TITULARES COM 74 ANOS OU MENOS",
                Valor: "SIM"
              },
              {
                CoberturaId: 39,
                CodigoCobertura: "BS006",
                CodigoTarifa: p.Rate,
                Titulo: "Traslado médico:",
                Conteudo: "INCLUIDO",
                Valor: "SIM"
              });
          });

          const valoresFiltro = [
            "PLANO 35", 
            "PLANO 60", 
            "PLANO 150", 
            "PLANO 250", 
            "PLANO 1M", 
            "PLANO NACIONAL 50", 
            "PLANO NACIONAL 100"
          ];

          const quotes: AssistCardCotacao[] = [];
          quotes.push(...produtos.filter(quote => valoresFiltro.includes(quote.RateDescription)));

          return quotes;
        }),
        catchError(() => {
          throw new ForbiddenException(
            'Assist Card not available to quote',
          );
        }),
      );
  }

  coberturas(
    dto: AssistCardCoberturasInput,
  ): Observable<AssistCardCoberturasResponse[]> {
    const {
      assistCardUrl
    } = this.getConfig();

    const headers = {
    };

    const input: AssistCardCoberturasInput = {
      ...dto
    };

    const url = assistCardUrl + '/APIjson/Comparativo';

    return this.httpService
      .post(url, input, {
        headers,
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new ForbiddenException(
            'Assist Card not available to quote',
          );
        }),
      );
  }

  compra(
    dto: AssistCardCompraInput,
  ): Observable<AssistCardCompraResponse> {
    const {
      assistCardUrl,
      assistCardLogin,
      assistCardSenha
    } = this.getConfig();

    const headers = {
    };

    const input: AssistCardCompraInput = {
      ...dto
    };

    const url = assistCardUrl + '/APIjson/Emissao';
    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error({ input, error });
        throw new ForbiddenException(
          'Assist Card not available to purchase',
        );
      }),
    );
  }

  private getConfig() {
    const assistCardUrl = this.configService.get(
      'assistCard.assistCardUrl',
      {
        infer: true,
      },
    );

    const assistCardLogin = this.configService.get(
      'assistCard.assistCardLogin',
      {
        infer: true,
      },
    );

    const assistCardSenha = this.configService.get(
      'assistCard.assistCardSenha',
      {
        infer: true,
      },
    );

    return {
      assistCardUrl,
      assistCardLogin,
      assistCardSenha
    };
  }
}

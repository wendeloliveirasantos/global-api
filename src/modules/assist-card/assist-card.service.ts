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
            p.Coberturas = [];
            p.Coberturas.push({
              CoberturaId: 13,
              CodigoCobertura: "",
              CodigoTarifa: p.Rate,
              Titulo: "Despesas médicas e hospitalares",
              Conteudo: "",
              Valor: "$ " + p.DmhoAmount
            },
            {
              CoberturaId: 13,
              CodigoCobertura: "",
              CodigoTarifa: p.Rate,
              Titulo: "Despesas médicas por covid-19",
              Conteudo: "",
              Valor: "$ 30.000"
            },
            {
              CoberturaId: 33,
              CodigoCobertura: "",
              CodigoTarifa: 1,
              Titulo: "Cancelamento de viagem",
              Conteudo: "",
              Valor: "$ 2.000"
            });
          });
          return produtos;
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

import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map, tap } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { UniversalAssistanceTravelCotacao } from './types/universal-assistance-travel-cotacao-response';
import { UniversalAssistanceTravelCotacaoInput } from './types/universal-assistance-travel-cotacao';
import {
  UniversalAssistanceTravelObjetoViagem,
  UniversalAssistanceTravelObjetoViagemControllerInput,
} from './types/universal-assistance-travel-compra-input';

@Injectable()
export class UniversalAssistanceTravelService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(UniversalAssistanceTravelService.name);

  cotacao(
    cotacaoDto: Pick<
      UniversalAssistanceTravelCotacaoInput,
      'dataRetorno' | 'dataSaida' | 'destinos' | 'passageiros'
    >,
  ): Observable<UniversalAssistanceTravelCotacao> {
    const {
      universalAssistanceTraveUrl,
      universalAssistanceTravelLogin,
      universalAssistanceTravelSenha,
      universalAssistanceTravelTipoTarifa,
      universalAssistanceTravelTipoViagem,
    } = this.getConfig();

    const headers = {
      login: universalAssistanceTravelLogin,
      senha: universalAssistanceTravelSenha,
    };

    const input: UniversalAssistanceTravelCotacaoInput = {
      ...cotacaoDto,
      tipoTarifa: universalAssistanceTravelTipoTarifa,
      tipoViagem: universalAssistanceTravelTipoViagem,
    };

    const url = universalAssistanceTraveUrl + '/v1/Cotacao';

    return this.httpService
      .post(url, input, {
        headers,
      })
      .pipe(
        map((res) => {
          var data = res.data as UniversalAssistanceTravelCotacao;
          var produtos = data.produtos.filter(p => p.multiviagem == false);
          data.produtos = [];
          data.produtos.push(...produtos);
          return data;
        }),
        catchError(() => {
          throw new ForbiddenException(
            'Universal Assistance Travel not available to quote',
          );
        }),
      );
  }

  compra(
    dto: UniversalAssistanceTravelObjetoViagemControllerInput,
  ): Observable<UniversalAssistanceTravelCompraResponse> {
    const {
      universalAssistanceTraveUrl,
      universalAssistanceTravelLogin,
      universalAssistanceTravelSenha,
      universalAssistanceTravelTipoTarifa,
      universalAssistanceTravelTipoViagem,
    } = this.getConfig();

    const headers = {
      login: universalAssistanceTravelLogin,
      senha: universalAssistanceTravelSenha,
    };

    const input: UniversalAssistanceTravelObjetoViagem = {
      ...dto,
      dadosBasicos: {
        ...dto.dadosBasicos,
        tipoTarifa: universalAssistanceTravelTipoTarifa,
        tipoViagem: universalAssistanceTravelTipoViagem,
      },
    };

    const url = universalAssistanceTraveUrl + '/v1/Compras';

    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => res.data),
      catchError((error) => {
        if (error.response.status == 400) {
          throw new BadRequestException(
            error.response.data.message,
          );
        }
        else {
          throw new ForbiddenException(
            'Universal Assistance Travel not available to purchase',
          );
        }
      }),
    );
  }

  destinos(): Observable<UniversalAssistanceTravelDestinosResponse[]> {
    const {
      universalAssistanceTraveUrl,
      universalAssistanceTravelLogin,
      universalAssistanceTravelSenha
    } = this.getConfig();

    const headers = {
      login: universalAssistanceTravelLogin,
      senha: universalAssistanceTravelSenha,
    };

    const url = universalAssistanceTraveUrl + '/v1/destinos';

    return this.httpService
      .get(url, {
        headers,
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new ForbiddenException(
            'Universal Assistance Travel not available to quote',
          );
        }),
      );
  }

  private getConfig() {
    const universalAssistanceTraveUrl = this.configService.get(
      'universalAssistanceTravel.universalAssistanceTravelUrl',
      {
        infer: true,
      },
    );

    const universalAssistanceTravelTipoTarifa = this.configService.get(
      'universalAssistanceTravel.universalAssistanceTravelTipoTarifa',
      {
        infer: true,
      },
    );

    const universalAssistanceTravelTipoViagem = this.configService.get(
      'universalAssistanceTravel.universalAssistanceTravelTipoViagem',
      {
        infer: true,
      },
    );

    const universalAssistanceTravelLogin = this.configService.get(
      'universalAssistanceTravel.universalAssistanceTravelLogin',
      {
        infer: true,
      },
    );

    const universalAssistanceTravelSenha = this.configService.get(
      'universalAssistanceTravel.universalAssistanceTravelSenha',
      {
        infer: true,
      },
    );

    return {
      universalAssistanceTraveUrl,
      universalAssistanceTravelLogin,
      universalAssistanceTravelSenha,
      universalAssistanceTravelTipoTarifa,
      universalAssistanceTravelTipoViagem,
    };
  }
}

import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map, tap } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { CepResponse } from './types/cep-response';

@Injectable()
export class OutSideService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(OutSideService.name);

  consultarCep(cep: string): Observable<CepResponse> {
    const {
      cepUrl
    } = this.getConfig();

    const headers = {
    };

    const url = `https://viacep.com.br/ws/${cep}/json`;
    
    return this.httpService.get(url, { headers }).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error({ error });
        throw new ForbiddenException(
          'Cep not available to purchase',
        );
      }),
    );
  }

  private getConfig() {
    
    const cepUrl = this.configService.get(
      'outSide.cepUrl',
      {
        infer: true,
      },
    );
    return {
      cepUrl
    };
  }
}

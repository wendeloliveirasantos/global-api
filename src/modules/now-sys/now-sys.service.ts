import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, Observable, Subject, catchError, firstValueFrom, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { AllConfigType } from 'src/config/config.type';
import { NowSysCompraInput } from './types/now-sys-compra-input';
import { NowSysCotacaoInput } from './types/now-sys-cotacao';
import { NowSysCotacao } from './types/now-sys-response';
import { NowSysCoberturasInput } from './types/now-sys-coberturas-input';
import { NowSysTokenInput } from './types/now-sys-token-input';
import { NowSysTokenResponse } from './types/now-sys-token-response';
import { NowSysValidaTokenResponse } from './types/now-sys-valida-token-response';
import { NowSysProdutosResponse } from './types/now-sys-produtos-response';
import { NowSysProdutoResponse } from './types/now-sys-produto-response';
import { NowSysCoberturasResponse } from './types/now-sys-coberturas-response';
import { NowSysTokenCartaoInput } from './types/now-sys-token-cartao-input';
import { NowSysTokenCartaoResponse } from './types/now-sys-token-cartao-response';
import { NowSysInserirPropostaInput } from './types/now-sys-inserir-proposta-input';
import { NowSysInserirPropostaResponse } from './types/now-sys-inserir-proposta-response';


@Injectable()
export class NowSysService {

  public token: BehaviorSubject<NowSysTokenResponse>;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {
    this.token = new BehaviorSubject<NowSysTokenResponse>(null);
  }

  private readonly logger = new Logger(NowSysService.name);
  
  autenticacao(): Observable<NowSysTokenResponse> {
    const {
      nowSysUrl,
      nowSysLogin,
      nowSysSenha
    } = this.getConfig();

    const headers = {
    };

    const input: NowSysTokenInput = {
      login: nowSysLogin,
      senha: nowSysSenha
    };

    const url = nowSysUrl + '/login';
    
    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => { 
        this.token.next(res.data);
        return res.data }),
      catchError((error) => {
        this.logger.error({ input, error });
        throw new ForbiddenException(
          'Now Sys not available to purchase',
        );
      }),
    );
  }

  validaToken(): Observable<NowSysValidaTokenResponse> {
    const {
      nowSysUrl
    } = this.getConfig();

    const headers = {
      authorization: this.token.value.token
    };

    const url = nowSysUrl + '/auth';
    
    return this.httpService.get(url, { headers }).pipe(
      map((res) => res.data),
      catchError((error) => {
        this.logger.error({ error });
        throw new ForbiddenException(
          'Now Sys not available to purchase',
        );
      }),
    );
  }

  listaProdutos(): Observable<NowSysProdutosResponse> {
    const {
      nowSysUrl
    } = this.getConfig();

    const headers = {
      authorization: this.token.value.token
    };

    const url = nowSysUrl + '/produtos';

    return this.httpService
      .get(url, {
        headers,
      })
      .pipe(
        map((res) => { 
          const itemsArray = JSON.parse(res.data.items);
          const response = { ...res.data, items: itemsArray };
          return response }),
        catchError(() => {
          throw new ForbiddenException(
            'Now Sys not available to quote',
          );
        }),
      );
  }

  buscarProduto(codigo: number): Observable<NowSysProdutoResponse> {
    const {
      nowSysUrl
    } = this.getConfig();

    const headers = {
      authorization: this.token.value.token
    };

    const url = nowSysUrl + '/produtos/' + codigo;

    return this.httpService
      .get(url, {
        headers,
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          throw new ForbiddenException(
            'Now Sys not available to quote',
          );
        }),
      );
  }

  gerarTokenCartao(
    dto: NowSysTokenCartaoInput
  ): Observable<NowSysTokenCartaoResponse> {
    const {
      nowSysUrl
    } = this.getConfig();

    const headers = {
      authorization: this.token.value.token
    };

    const input: NowSysTokenCartaoInput = {
      ...dto
    };

    const url = nowSysUrl + '/cobranca/token';
    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => {
        if (res.data.status == 'Sucesso') {
          return res.data.retorno
        }
        else{
          throw new BadRequestException(
            'Now Sys not available to purchase',
          );
        }
      }),
      catchError((error) => {
        this.logger.error({ input, error });
        throw new ForbiddenException(
          'Now Sys not available to purchase',
        );
      }),
    );
  }

  inserirProposta(
    dto: NowSysInserirPropostaInput
  ): Observable<NowSysInserirPropostaResponse> {
    const {
      nowSysUrl
    } = this.getConfig();

    const headers = {
      authorization: this.token.value.token
    };

    const input: NowSysInserirPropostaInput = {
      ...dto
    };

    const url = nowSysUrl + '/proposta';
    return this.httpService.post(url, input, { headers }).pipe(
      map((res) => {
        if (res.data.status == 'Sucesso') {
          return res.data.retorno
        }
        else{
          throw new BadRequestException(
            'Now Sys not available to purchase',
          );
        }
      }),
      catchError((error) => {
        this.logger.error({ input, error });
        throw new ForbiddenException(
          'Now Sys not available to purchase',
        );
      }),
    );
  }

  cotacao(
    dto: NowSysCotacaoInput,
  ): Observable<NowSysCotacao[]> {
    
    return this.listaProdutos().pipe(
      switchMap((res) => {
        const planos = res.items.filter(item => item.nome.includes(dto.business));
        const buscaProdutoObservables = planos.map(plano =>
          this.buscarProduto(parseInt(plano.codigo)).pipe(
            map((res) => ({ ...plano, ...res.produto.caracteristicas }))
          )
        );
        return of(buscaProdutoObservables);
      }),
      switchMap(buscaProdutoObservables =>
        buscaProdutoObservables.length ? forkJoin(buscaProdutoObservables) : of([])
      ),
      map((planoAtualizado: any) => {
        const quotes = planoAtualizado as NowSysCotacao[];
        return quotes;
      })
    );
  }

  private getConfig() {
    const nowSysUrl = this.configService.get(
      'nowSys.nowSysUrl',
      {
        infer: true,
      },
    );

    const nowSysLogin = this.configService.get(
      'nowSys.nowSysLogin',
      {
        infer: true,
      },
    );

    const nowSysSenha = this.configService.get(
      'nowSys.nowSysSenha',
      {
        infer: true,
      },
    );

    return {
      nowSysUrl,
      nowSysLogin,
      nowSysSenha
    };
  }
}

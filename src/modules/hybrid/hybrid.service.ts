import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HybridQuoteDto } from './dto/hybrid-quote.dto';
import { firstValueFrom, forkJoin, map } from 'rxjs';
import { HybridQuoteResponse } from './types/hybrid-quote-response';
import { InjectModel } from '@nestjs/mongoose';
import { HybridQuote } from './schemas/hybrid-quote';
import { Model } from 'mongoose';
import { HybridCompraDto } from './dto/hybrid-compra.dto';
import { CustomerService } from '../customer/customer.service';
import { HybridCompra } from './schemas/hybrid-compra';
import { NowSysService } from '../now-sys/now-sys.service';
import { NowSysTokenResponse } from '../now-sys/types/now-sys-token-response';
import { OutSideService } from '../outside/outside.service';
import { NowSysCotacao } from '../now-sys/types/now-sys-response';
import { addMonths, format } from 'date-fns';
import { NowSysTokenCartaoResponse } from '../now-sys/types/now-sys-token-cartao-response';
import { NowSysInserirPropostaResponse } from '../now-sys/types/now-sys-inserir-proposta-response';
import { calcularIdade } from 'src/utils/gerais';
import { ItemSegurado } from '../now-sys/types/now-sys-inserir-proposta';

@Injectable()
export class HybridService {
  public quotes: HybridQuoteResponse[] = [];
  public nowSystoken: NowSysTokenResponse;
  constructor(
    private nowSysService: NowSysService,
    private outSideService: OutSideService,
    @InjectModel(HybridQuote.name)
    private readonly hybridQuoteModel: Model<HybridQuote>,
    private customerService: CustomerService,
    @InjectModel(HybridCompra.name)
    private readonly hybridCompraModel: Model<HybridCompra>,
  ) {}

  async cotacao(hybridQuoteDto: HybridQuoteDto): Promise<any> {
    this.quotes = [];
    await this.autenticacaoNowSys();
    await this.cotacaoNowSys(hybridQuoteDto);
    return this.quotes;
  }

  async compra(compraDto: HybridCompraDto) {
    await this.autenticacaoNowSys();
    var tokenCartao = await this.gerarTokenCartaoNowSys(compraDto);
    var cobranca = await this.geraCobrancaNowSys(compraDto, tokenCartao);
    return this.compraNowSys(compraDto, cobranca);
  }

  consultarCep(cep: string): any {
    return forkJoin([
      this.outSideService.consultarCep(cep)
    ]).pipe(
      map(async ([response]) => {
        return response;
      }),
    );
  }

  private async autenticacaoNowSys() {

    return new Promise<void>((resolve, reject) => {
      this.nowSysService.autenticacao().subscribe({
        next: async (response) => {
          this.nowSystoken = response;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

  private async gerarTokenCartaoNowSys(compraDto: HybridCompraDto) {
    return new Promise<NowSysTokenCartaoResponse>((resolve, reject) => {
      this.nowSysService.gerarTokenCartao({
        number: compraDto.payment.cardNumber,
        verification_value: compraDto.payment.securityCode,
        first_name: compraDto.payment.cardholderName.split(' ')[0],
        last_name: compraDto.payment.cardholderName.split(' ').slice(1).join(' '),
        month: compraDto.payment.expiryMonth,
        year: compraDto.payment.expiryYear,
      }).subscribe({
        next: async (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

  private async cotacaoNowSys(hybridQuoteDto: HybridQuoteDto) {
    const quotes: HybridQuoteResponse[] = [];
    return new Promise<void>((resolve, reject) => {
      this.nowSysService.cotacao({
        business: hybridQuoteDto.business,
        birthDate: hybridQuoteDto.birthDate
      }).subscribe({
        next: async (response) => {
          const result = response.filter(item => {
            const valor = parseFloat(item.coberturas[0].premio.faixasImportanciaSegurada[0].importanciaSegurada.replace(/\./g, ""));
            return valor <= hybridQuoteDto.range * 1000;
          });
          for (const produto of result) {
            const premioTotal = produto.coberturas.reduce((total, cobertura) => {
                return total + (cobertura.premio.faixasImportanciaSegurada[0].premioTotal || 0);
            }, 0);
            const inputProduto: HybridQuoteResponse = {
              operator: 'nowSys',
              productReferenceId: produto.codigo,
              productRate: produto.codigo,
              amount: parseFloat(premioTotal.toFixed(2)),
              additionalDescription: null,
              description: produto.nome,
              coverage: produto.coberturas.map((cobertura, index) => {
                return {
                  description: cobertura.nome,
                  fullDescription: cobertura.premio.faixasImportanciaSegurada[0].franquia,
                  amount: cobertura.premio.faixasImportanciaSegurada[0].importanciaSegurada,
                  orderIndex: index + 1,
                  coverageReferenceId: cobertura.codigo,
                };
              }),
            };
            inputProduto.coverage = inputProduto.coverage.concat(produto.assistencias.map((assistencia, index) => ({
              description: assistencia.nome,
              fullDescription: assistencia.nome,
              amount: assistencia.importanciasegurada.toString(),
              orderIndex: produto.coberturas.length + index + 1,
              coverageReferenceId: assistencia.codigo,
            })));
            const hybridQuote = await this.hybridQuoteModel.create({
              provider: 'nowSys',
              business: hybridQuoteDto.business,
              metadata: JSON.stringify(produto),
            });
            quotes.push({ id: hybridQuote.id, ...inputProduto });
          }
          
          this.quotes.push(...quotes);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

  private async compraNowSys(compraDto: HybridCompraDto, cobranca: NowSysInserirPropostaResponse) {
    const cotacao = await this.hybridQuoteModel.findById(compraDto.quoteId);
    if (!cotacao)
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    
    const hybridQuote = JSON.parse(
      cotacao.metadata,
    ) as NowSysCotacao;

    if (!hybridQuote) new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const dataAtual = new Date();
    const dataDaqui12Meses = addMonths(dataAtual, 12);
    const dataDaqui1Meses = addMonths(dataAtual, 1);
    const item_segurado = [
      {
        identificacao: hybridQuote.nome,
        descricao: 'comercial',
        vigencia: {
          data_inicio: format(dataAtual, 'yyyy-MM-dd'),
          data_fim: format(dataDaqui12Meses, 'yyyy-MM-dd')
        },
        caracteristicas: {
          basico: null,
          endereco: {
            logradouro: compraDto.holder.address,
            numero: compraDto.holder.number,
            complemento: '',
            bairro: compraDto.holder.neighborhood,
            cidade: compraDto.holder.city,
            siglaestado: compraDto.holder.uf,
            cep: compraDto.holder.zipCode,
          },
          enquadramento: {
            local_de_risco: {
              cep: compraDto.holder.zipCode,
              descricao: 'comercial'
            },
            score: null,
            sexo: compraDto.holder.gender,
            idade: calcularIdade(compraDto.holder.birthDate).toString(),
            utilizacao: 'comercial',
            birthday: compraDto.holder.birthDate,
            marital_status: null,
            garage: null,
            alienado: null,
            desconto: 0
          }
        }
      }
    ];

    const responseCompra = await firstValueFrom(
      await this.nowSysService.inserirProposta({
        proposta: {
          dados_proposta: [
            {
              produto: { 
                codigo_produto: hybridQuote.codigo,
                nome_produto: hybridQuote.nome,
                codigoComercial: hybridQuote.codigoComercial
              },
              data_base_calculo: format(dataAtual, 'yyyy-MM-dd'),
              vigencia: { 
                data_inicio: format(dataAtual, 'yyyy-MM-dd'),
                data_fim: format(dataDaqui12Meses, 'yyyy-MM-dd')
              },
              dtemissao: format(dataAtual, 'yyyy-MM-dd'),
              nrproposta: compraDto.quoteId,
              estipulante: null,
              propostaid: null,
              dtrecepcao: null,
              situacao: null,
              corretor: null,
              nrsusep: null,
              credencial: null
            }
          ],
          segurado: {
            nome: compraDto.holder.firstName + ' ' + (compraDto.holder.lastName || '') || compraDto.holder.companyName,
            cpf_cnpj: compraDto.holder.cpfNumber || compraDto.holder.cnpjNumber,
            endereco: {
              logradouro: compraDto.holder.address,
              numero: compraDto.holder.number,
              complemento: '',
              bairro: compraDto.holder.neighborhood,
              cidade: compraDto.holder.city,
              siglaestado: compraDto.holder.uf,
              cep: compraDto.holder.zipCode,
            },
            contato: [
              {
                tipo: 'email',
                descricao: compraDto.holder.email,
              },
              {
                tipo: 'celular',
                descricao: compraDto.holder.cellPhone,
              },
            ],
          },
          item_segurado: hybridQuote.nome.includes('Empresarial') || hybridQuote.nome.includes('Hibrido') ? item_segurado : null,
          cobranca: cobranca.proposta.cobranca,
        }
      }),
    );

    let customer;

    // customer = await this.customerService.findOneByCpf(
    //   compraDto.holder.cpfNumber,
    // );
    // if (!customer) {
      
    // }

    customer = await this.customerService.createCustomer({
      firstName: compraDto.holder.firstName || compraDto.holder.companyName,
      lastName: compraDto.holder.lastName,
      cpfNumber: compraDto.holder.cpfNumber || compraDto.holder.cnpjNumber,
      cellPhone: compraDto.holder.cellPhone,
      email: compraDto.holder.email,
      address: compraDto.holder.address,
      zipCode: compraDto.holder.zipCode,
      number: compraDto.holder.number,
      neighborhood: compraDto.holder.neighborhood,
      city: compraDto.holder.city,
      uf: compraDto.holder.uf,
      birthDate: compraDto.holder.birthDate,
    });

    await this.hybridCompraModel.create({
      contato: customer,
      provider: 'nowSys',
      metadata: JSON.stringify(responseCompra),
    });
    
    return responseCompra;
  }

  private async geraCobrancaNowSys(compraDto: HybridCompraDto, tokenCartao: NowSysTokenCartaoResponse) {
    const cotacao = await this.hybridQuoteModel.findById(compraDto.quoteId);
    if (!cotacao)
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    
    const hybridQuote = JSON.parse(
      cotacao.metadata,
    ) as NowSysCotacao;

    if (!hybridQuote) new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const dataAtual = new Date();
    const dataDaqui12Meses = addMonths(dataAtual, 12);
    const dataDaqui1Meses = addMonths(dataAtual, 1);

    const item_segurado = [
      {
        identificacao: hybridQuote.nome,
        descricao: 'comercial',
        vigencia: {
          data_inicio: format(dataAtual, 'yyyy-MM-dd'),
          data_fim: format(dataDaqui12Meses, 'yyyy-MM-dd')
        },
        caracteristicas: {
          basico: null,
          endereco: {
            logradouro: compraDto.holder.address,
            numero: compraDto.holder.number,
            complemento: '',
            bairro: compraDto.holder.neighborhood,
            cidade: compraDto.holder.city,
            siglaestado: compraDto.holder.uf,
            cep: compraDto.holder.zipCode,
          },
          enquadramento: {
            local_de_risco: {
              cep: compraDto.holder.zipCode,
              descricao: 'comercial'
            },
            score: null,
            sexo: compraDto.holder.gender,
            idade: calcularIdade(compraDto.holder.birthDate).toString(),
            utilizacao: 'comercial',
            birthday: compraDto.holder.birthDate,
            marital_status: null,
            garage: null,
            alienado: null,
            desconto: 0
          }
        }
      }
    ];

    const responseCompra = await firstValueFrom(
      await this.nowSysService.inserirProposta({
        proposta: {
          dados_proposta: [
            {
              produto: { 
                codigo_produto: hybridQuote.codigo,
                nome_produto: hybridQuote.nome,
                codigoComercial: hybridQuote.codigoComercial
              },
              data_base_calculo: format(dataAtual, 'yyyy-MM-dd'),
              vigencia: { 
                data_inicio: format(dataAtual, 'yyyy-MM-dd'),
                data_fim: format(dataDaqui12Meses, 'yyyy-MM-dd')
              },
              dtemissao: format(dataAtual, 'yyyy-MM-dd'),
              nrproposta: compraDto.quoteId,
              estipulante: null,
              propostaid: null,
              dtrecepcao: null,
              situacao: null,
              corretor: null,
              nrsusep: null,
              credencial: null
            }
          ],
          segurado: {
            nome: compraDto.holder.firstName + ' ' + (compraDto.holder.lastName || '') || compraDto.holder.companyName,
            cpf_cnpj: compraDto.holder.cpfNumber || compraDto.holder.cnpjNumber,
            endereco: {
              logradouro: compraDto.holder.address,
              numero: compraDto.holder.number,
              complemento: '',
              bairro: compraDto.holder.neighborhood,
              cidade: compraDto.holder.city,
              siglaestado: compraDto.holder.uf,
              cep: compraDto.holder.zipCode,
            },
            contato: [
              {
                tipo: 'email',
                descricao: compraDto.holder.email,
              },
              {
                tipo: 'celular',
                descricao: compraDto.holder.cellPhone,
              },
            ],
          },
          item_segurado: hybridQuote.nome.includes('Empresarial') || hybridQuote.nome.includes('Hibrido') ? item_segurado : null,
          cobranca: {
            tipocobranca: 'iugu',
            cliente_id: null,
            token_card: tokenCartao.retorno.id,
            pagamento_id: 'iugu_id_pagamento',
            fatura_id: null,
            url_fatura: null,
            assinatura_id: null,
            qtparcelas: compraDto.payment.installments,
            operadora_cobranca: {
              nome: 'IUGU',
            },
            parcelas_cobradas: {
              nrparcela: compraDto.payment.installments,
              dtvencimento: format(dataAtual, 'yyyy-MM-dd'),
              dtrecebido: format(dataAtual, 'yyyy-MM-dd'),
              valorparcela: hybridQuote.coberturas.reduce((total, cobertura) => { 
                return total + (cobertura.premio.faixasImportanciaSegurada[0].premioTotal || 0);}, 0),
              valor_recebido: hybridQuote.coberturas.reduce((total, cobertura) => { 
                return total + (cobertura.premio.faixasImportanciaSegurada[0].premioTotal || 0);}, 0),
              identificacao: 'iugu_id_pagamento',
            }
          },
        }
      }),
    );

    return responseCompra;
  }
}

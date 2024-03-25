import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UniversalAssistanceTravelService } from '../universal-assistance/universal-assistance-travel.service';
import { TravelQuoteDto } from './dto/travel-quote.dto';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { TravelQuoteResponse } from './types/travel-quote-response';
import { InjectModel } from '@nestjs/mongoose';
import { TravelQuote } from './schemas/travel-quote';
import { Model } from 'mongoose';
import { TravelCompraDto } from './dto/travel-compra.dto';
import { UniversalAssistanceTravelCotacao } from '../universal-assistance/types/universal-assistance-travel-cotacao-response';
import { UniversalAssistanceTravelTipoDeDocumentoEnum } from '../universal-assistance/universal-assistance-travel.enum';
import { CustomerService } from '../customer/customer.service';
import { TravelCompra } from './schemas/travel-compra';
import { AssistCardService } from '../assist-card/assist-card.service';
import { AssistCardTokenResponse } from '../assist-card/types/assist-card-token-response';
import { OutSideService } from '../outside/outside.service';
import { AssistCardCotacaoInput } from '../assist-card/types/assist-card-cotacao';
import { AssistCardCotacao } from '../assist-card/types/assist-card-response';
import { AssistCardCompraInput, Passageiro } from '../assist-card/types/assist-card-compra-input';

@Injectable()
export class TravelService {
  public quotes: TravelQuoteResponse[] = [];
  public assistCardtoken: AssistCardTokenResponse;
  constructor(
    private universalAssistanceTravelService: UniversalAssistanceTravelService,
    private assistCardService: AssistCardService,
    private outSideService: OutSideService,
    @InjectModel(TravelQuote.name)
    private readonly travelQuoteModel: Model<TravelQuote>,
    private customerService: CustomerService,
    @InjectModel(TravelCompra.name)
    private readonly travelCompraModel: Model<TravelCompra>,
  ) {}

  async cotacao(travelQuoteDto: TravelQuoteDto): Promise<any> {
    this.quotes = [];
    
    await this.cotacaoUniversalAssistance(travelQuoteDto);

    await this.autenticacaoAssistCard();

    await this.cotacaoAssistCard(travelQuoteDto, this.assistCardtoken.sessionKey);

    return this.quotes;
  }

  async compra(compraDto: TravelCompraDto) {
    if (compraDto.provider == 'universal') {
      return this.compraUniversalAssistance(compraDto);
    }
    else if (compraDto.provider == 'assistCard') {
      await this.autenticacaoAssistCard();
      return this.compraAssistCard(compraDto, this.assistCardtoken.sessionKey);
    }
  }

  destinos(): any {
    return forkJoin([
      this.universalAssistanceTravelService.destinos()
    ]).pipe(
      map(async ([response]) => {
        return response;
      }),
    );
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

  private async autenticacaoAssistCard() {
    const quotes: TravelQuoteResponse[] = [];
    
    return new Promise<void>((resolve, reject) => {
      this.assistCardService.autenticacao().subscribe({
        next: async (response) => {
          this.assistCardtoken = response;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

  private async cotacaoAssistCard(travelQuoteDto: TravelQuoteDto, sessionKey: string) {
    const quotes: TravelQuoteResponse[] = [];
    
    return new Promise<void>((resolve, reject) => {
      this.assistCardService.cotacao({
        destiny: parseInt(travelQuoteDto.destiny.split(';')[0]),
        departuredate: travelQuoteDto.departureDate,
        returndate: travelQuoteDto.returnDate,
        birthdates: travelQuoteDto.passengers.map((row) => ({
          birthdate: row.birthDate,
        })),
        isB2cProject: false,
        isCreditCard: true,
        markup: 0.0,
        promotionalCode: null,
        sessiontoken: sessionKey
      }).subscribe({
        next: async (response) => {
          const result = response.filter(item => {
            const valor = parseFloat(item.DmhoAmount.replace(/\./g, ""));
            return valor <= travelQuoteDto.range * 1000;
          });
          for (const produto of result) {
            const inputProduto: TravelQuoteResponse = {
              operator: 'assistCard',
              productReferenceId: produto.CodigoProduto,
              productRate: produto.Rate,
              amount: produto.Amount,
              additionalDescription: null,
              description: produto.RateDescription,
              destinations: JSON.stringify(parseInt(travelQuoteDto.destiny.split(';')[0])),
              coverage: produto.Coberturas.map((cobertura, index) => {
                return {
                  description: cobertura.Titulo,
                  fullDescription: cobertura.Conteudo,
                  amount: cobertura.Valor,
                  orderIndex: cobertura.CoberturaId,
                  coverageReferenceId: cobertura.CoberturaId,
                };
              }),
            };
            const travelQuote = await this.travelQuoteModel.create({
              provider: 'assistCard',
              destinations: JSON.stringify(parseInt(travelQuoteDto.destiny.split(';')[0])),
              metadata: JSON.stringify(produto),
            });
            quotes.push({ id: travelQuote.id, ...inputProduto });
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

  private async cotacaoUniversalAssistance(travelQuoteDto: TravelQuoteDto) {
    const quotes: TravelQuoteResponse[] = [];
    return new Promise<void>((resolve, reject) => {
      this.universalAssistanceTravelService.cotacao({
        destinos: [travelQuoteDto.destiny.split(';')[1]],
        dataSaida: travelQuoteDto.departureDate,
        dataRetorno: travelQuoteDto.returnDate,
        passageiros: travelQuoteDto.passengers.map((row) => ({
          dataNascimento: row.birthDate,
        }))
      }).subscribe({
        next: async (response) => {
          var result = response.produtos.filter(p => p.beneficios[0].valorEmDinheiro <= travelQuoteDto.range*1000);
          for (const produto of result) {
            const inputProduto: TravelQuoteResponse = {
              operator: 'universal',
              productReferenceId: produto.idProduto,
              productRate: null,
              amount: produto.tarifa.valor,
              additionalDescription: produto.descricaoAdicional,
              description: produto.descricao,
              destinations: JSON.stringify([travelQuoteDto.destiny.split(';')[1]]),
              coverage: produto.beneficios.map((benefit, index) => {
                const existCoverage = response.beneficios.find(
                  (b) => b.idBeneficio === benefit.idBeneficio,
                );
                if (existCoverage) {
                  return {
                    description: existCoverage.descricao,
                    fullDescription: existCoverage.descricaoCompleta,
                    amount: benefit.valor,
                    orderIndex: existCoverage.ordem,
                    coverageReferenceId: existCoverage.idBeneficio,
                  };
                }
              }),
            };
            const travelQuote = await this.travelQuoteModel.create({
              provider: 'universal',
              destinations: JSON.stringify([travelQuoteDto.destiny.split(';')[1]]),
              metadata: JSON.stringify(response),
            });
            quotes.push({ id: travelQuote.id, ...inputProduto });
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

  private async compraUniversalAssistance(compraDto: TravelCompraDto) {
    const cotacao = await this.travelQuoteModel.findById(compraDto.quoteId);
    
    if (!cotacao)
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);

    const travelQuote = JSON.parse(
      cotacao.metadata,
    ) as UniversalAssistanceTravelCotacao;

    const produto = await travelQuote.produtos.find(
      (produto) =>
        JSON.stringify(produto.idProduto) === compraDto.productReferenceId,
    );

    if (!produto) new HttpException('Product not found', HttpStatus.NOT_FOUND);
    
    // const dadosIntegrantes = compraDto.passengers?.map((passageiro: any) => ({
    //   codigo: 2,
    //   nome: passageiro.firstName,
    //   sobrenome: passageiro.lastName,
    //   documento: passageiro.document,
    //   tipoDocumento: UniversalAssistanceTravelTipoDeDocumentoEnum.cpf,
    //   telefone: compraDto.holder.cellPhone,
    //   email: compraDto.holder.email,
    //   endereco: compraDto.holder.address,
    //   cep: compraDto.holder.zipCode,
    //   numero: compraDto.holder.number,
    //   bairro: compraDto.holder.neighborhood,
    //   cidade: compraDto.holder.city,
    //   dataNascimento: passageiro.birthDate,
    //   uf: compraDto.holder.uf,
    // })) || null;

    const responseCompra = await firstValueFrom(
      await this.universalAssistanceTravelService.compra({
        dadosBasicos: {
          destinos: JSON.parse(cotacao.destinations),
          dataSaida: travelQuote.dataInicial,
          dataRetorno: travelQuote.dataFinal,
          valorCompra: produto.tarifa.valor,
          formaPagamento: 2,
          nomeContatoBrasil: compraDto.emergencyContact.name,
          telefoneContatoBrasil: compraDto.emergencyContact.cellPhone,
        },
        dadosTitular: {
          codigo: 1,
          nome: compraDto.holder.firstName,
          sobrenome: compraDto.holder.lastName,
          documento: compraDto.holder.cpfNumber,
          tipoDocumento: UniversalAssistanceTravelTipoDeDocumentoEnum.cpf,
          telefone: compraDto.holder.cellPhone,
          email: compraDto.holder.email,
          endereco: compraDto.holder.address,
          cep: compraDto.holder.zipCode,
          numero: compraDto.holder.number,
          bairro: compraDto.holder.neighborhood,
          cidade: compraDto.holder.city,
          dataNascimento: compraDto.holder.birthDate,
          uf: compraDto.holder.uf,
        },
        dadosIntegrantes: null,
        dadosProdutos: {
          codigoProduto: produto.idProduto,
          valorProduto: produto.tarifa.valor,
          codigoPeriodoMultiViagem: 0,
          codigoTarifaAcordo: 0,
        },
        dadosPagamento: {
          codigoOperadora: this.obterCodigoOperadoraUniversal(compraDto.payment.operator),
          nomeTitularCartao: compraDto.payment.cardholderName,
          cpfTitular: compraDto.payment.cardholderCPF,
          numeroCartao: compraDto.payment.cardNumber,
          codigoSeguranca: compraDto.payment.securityCode,
          mesValidade: compraDto.payment.expiryMonth,
          anoValidade: compraDto.payment.expiryYear,
          parcelas: compraDto.payment.installments,
        },
      }),
    );

    let customer;

    customer = await this.customerService.findOneByCpf(
      compraDto.holder.cpfNumber,
    );
    if (!customer) {
      customer = await this.customerService.createCustomer({
        firstName: compraDto.holder.firstName,
        lastName: compraDto.holder.lastName,
        cpfNumber: compraDto.holder.cpfNumber,
        cellPhone: compraDto.holder.cellPhone,
        address: compraDto.holder.address,
        zipCode: compraDto.holder.zipCode,
        number: compraDto.holder.number,
        neighborhood: compraDto.holder.neighborhood,
        city: compraDto.holder.city,
        uf: compraDto.holder.uf,
        birthDate: compraDto.holder.birthDate,
      });
    }

    await this.travelCompraModel.create({
      contato: customer,
      provider: 'universal',
      metadata: JSON.stringify(responseCompra),
    });

    return responseCompra;
  }

  private async compraAssistCard(compraDto: TravelCompraDto, sessionKey: string) {
    const cotacao = await this.travelQuoteModel.findById(compraDto.quoteId);

    if (!cotacao)
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    
    const travelQuote = JSON.parse(
      cotacao.metadata,
    ) as AssistCardCotacao;

    if (!travelQuote) new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const titular = {
      name: compraDto.holder.firstName,
      lastname: compraDto.holder.lastName, 
      documentcountry: 'Brasil',
      documenttype: 9, 
      documentnumber: compraDto.holder.cpfNumber, 
      birthdate: compraDto.holder.birthDate, 
      gender: compraDto.holder.gender, 
      email: compraDto.holder.email, 
      phone: compraDto.holder.cellPhone, 
      zipcode: compraDto.holder.zipCode, 
      address: compraDto.holder.address, 
      number: compraDto.holder.number, 
      district: compraDto.holder.neighborhood, 
      complement: '', 
      city: compraDto.holder.city, 
      state: compraDto.holder.uf, 
      contactfullname: compraDto.emergencyContact.name,
      contactphone: compraDto.emergencyContact.cellPhone, 
      additionaldata1: '', 
      additionaldata2: '', 
      upgrades: null
    };

    // const passageiros = compraDto.passengers?.map((passageiro: any) => ({
    //   name: passageiro.firstName,
    //   lastname: passageiro.lastName, 
    //   documentcountry: 'Brasil',
    //   documenttype: 9, 
    //   documentnumber: passageiro.document, 
    //   birthdate: passageiro.birthDate, 
    //   gender: passageiro.gender, 
    //   email: compraDto.holder.email, 
    //   phone: compraDto.holder.cellPhone, 
    //   zipcode: compraDto.holder.zipCode, 
    //   address: compraDto.holder.address, 
    //   number: compraDto.holder.number, 
    //   district: compraDto.holder.neighborhood, 
    //   complement: '', 
    //   city: compraDto.holder.city, 
    //   state: compraDto.holder.uf, 
    //   contactfullname: compraDto.emergencyContact.name,
    //   contactphone: compraDto.emergencyContact.cellPhone, 
    //   additionaldata1: '', 
    //   additionaldata2: '', 
    //   upgrades: null
    // })) || [];

    const passengers: Passageiro[] = [
      titular
    ];

    //passengers.push(...passageiros);

    const responseCompra = await firstValueFrom(
      await this.assistCardService.compra({
        productcode: "0V", //travelQuote.CodigoProduto,
        ratecode: 39995, //travelQuote.Rate,
        departuredate: travelQuote.departuredate,
        returndate: travelQuote.returndate,
        destiny: parseInt(JSON.parse(cotacao.destinations)),
        cash: false,
        creditcardid: 0,
        creditcardcpf: compraDto.payment.cardholderCPF,
        creditcardname: compraDto.payment.cardholderName,
        creditcardnumber: "5555666677778884", //compraDto.payment.cardNumber,
        expirationdate: compraDto.payment.expiryMonth + '/' + compraDto.payment.expiryYear,
        cardholdername: this.obterCodigoOperadoraAssistCard(compraDto.payment.operator).toString(),
        CurrencyCode: 2,
        instalments: compraDto.payment.installments,
        contactfullname: compraDto.emergencyContact.name,
        contactphone: compraDto.emergencyContact.cellPhone,
        passengers: JSON.stringify(passengers),
        upgrades: null,
        markup: 0.0,
        discount: 0.0,
        sessiontoken: "9U+DnBS26AFQv+u/CFc/CXENzNsAPJMF0c+hmMjIg3bcgfddxPFgwKZvozHnYB2h/wR3QotROrzm7HW5oPt7/tZztzFDjsA6CCiWqgmZbBg=", //sessionKey,
        additionalInformation: null,
        isB2cProject: false,
        promotionalCode: null,
        days: null,
        familyPlan: null,
        quotation: null
      }),
    );

    let customer;

    customer = await this.customerService.findOneByCpf(
      compraDto.holder.cpfNumber,
    );
    if (!customer) {
      customer = await this.customerService.createCustomer({
        firstName: compraDto.holder.firstName,
        lastName: compraDto.holder.lastName,
        cpfNumber: compraDto.holder.cpfNumber,
        cellPhone: compraDto.holder.cellPhone,
        address: compraDto.holder.address,
        zipCode: compraDto.holder.zipCode,
        number: compraDto.holder.number,
        neighborhood: compraDto.holder.neighborhood,
        city: compraDto.holder.city,
        uf: compraDto.holder.uf,
        birthDate: compraDto.holder.birthDate,
      });
    }

    await this.travelCompraModel.create({
      contato: customer,
      provider: 'assistCard',
      metadata: JSON.stringify(responseCompra),
    });
    
    return responseCompra;
  }

  private obterCodigoOperadoraUniversal(operadora) {
    switch (operadora.toLowerCase()) {
      case 'amex':
        return 1;
      case 'visa':
        return 2;
      case 'mastercard':
        return 3;
      default:
        return null;
    }
  }

  private obterCodigoOperadoraAssistCard(operadora) {
    switch (operadora.toLowerCase()) {
      case 'amex':
        return 3;
      case 'visa':
        return 1;
      case 'mastercard':
        return 2;
      default:
        return null;
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HybridQuoteDto } from './dto/hybrid-quote.dto';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
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
import { NowSysCotacaoInput } from '../now-sys/types/now-sys-cotacao';
import { NowSysCotacao } from '../now-sys/types/now-sys-response';
import { NowSysCompraInput, Passageiro } from '../now-sys/types/now-sys-compra-input';

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
    
    //await this.autenticacaoNowSys();

    await this.cotacaoNowSys(hybridQuoteDto);

    return this.quotes;
  }

  async compra(compraDto: HybridCompraDto) {
    if (compraDto.provider == 'nowSys') {
      await this.autenticacaoNowSys();
      return this.compraNowSys(compraDto);
    }
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
    const quotes: HybridQuoteResponse[] = [];
    
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

  private async cotacaoNowSys(hybridQuoteDto: HybridQuoteDto) {
    const quotes: HybridQuoteResponse[] = [];
    
    return new Promise<void>((resolve, reject) => {
      this.nowSysService.cotacao({
        business: hybridQuoteDto.business
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
                  amount: cobertura.premio.faixasImportanciaSegurada[0].premioTotal,
                  orderIndex: index + 1,
                  coverageReferenceId: cobertura.codigo,
                };
              }),
            };
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

  private async compraNowSys(compraDto: HybridCompraDto) {
    const cotacao = await this.hybridQuoteModel.findById(compraDto.quoteId);

    if (!cotacao)
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    
    const hybridQuote = JSON.parse(
      cotacao.metadata,
    ) as NowSysCotacao;

    if (!hybridQuote) new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const passengers: Passageiro[] = [
      {
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
      }
    ];

    const responseCompra = await firstValueFrom(
      await this.nowSysService.compra({
        productcode: "0V", //hybridQuote.CodigoProduto,
        ratecode: 39995, //hybridQuote.Rate,
        departuredate: '',
        returndate: '',
        destiny: 0,
        cash: false,
        creditcardid: 0,
        creditcardcpf: compraDto.payment.cardholderCPF,
        creditcardname: compraDto.payment.cardholderName,
        creditcardnumber: "5555666677778884", //compraDto.payment.cardNumber,
        expirationdate: compraDto.payment.expiryMonth + '/' + compraDto.payment.expiryYear,
        cardholdername: this.obterCodigoOperadoraNowSys(compraDto.payment.operator).toString(),
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

    await this.hybridCompraModel.create({
      contato: customer,
      provider: 'nowSys',
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

  private obterCodigoOperadoraNowSys(operadora) {
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

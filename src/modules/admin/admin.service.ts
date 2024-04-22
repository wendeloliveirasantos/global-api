import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminCreateUserResponse } from './types/admin-create-user-response';
import { Model } from 'mongoose';
import { TravelCompra } from '../travel/schemas/travel-compra';
import { HybridCompra } from '../hybrid/schemas/hybrid-compra';
import { InjectModel } from '@nestjs/mongoose';
import { NowSysCotacao } from '../now-sys/types/now-sys-response';
import { PurchasesResponse } from './types/purchases-response';
import { UniversalAssistanceTravelCotacao } from '../universal-assistance/types/universal-assistance-travel-cotacao-response';
import { AssistCardCotacao } from '../assist-card/types/assist-card-response';
import { NowSysInserirPropostaResponse } from '../now-sys/types/now-sys-inserir-proposta-response';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(TravelCompra.name)
    private readonly travelCompraModel: Model<TravelCompra>,
    @InjectModel(HybridCompra.name)
    private readonly hybridCompraModel: Model<HybridCompra>
  ) {}

  private readonly logger = new Logger(AdminService.name);

  async login(adminLoginDto: AdminLoginDto): Promise<string | null> {
    return this.userService.login(adminLoginDto.username, adminLoginDto.password);
  }

  async createUser(adminCreateUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponse> {
    const createdUser = await this.userService.createUser(adminCreateUserDto);
    return {
      name: createdUser.name,
      username: createdUser.username,
      email: createdUser.email,
    };
  }

  async listPurchases(): Promise<PurchasesResponse[] | null> {
    try {
      const purchasesHybrid = await this.hybridCompraModel.find().exec();
      const purchasesTravel = await this.travelCompraModel.find().exec();
      
      if (!purchasesHybrid && !purchasesTravel) {
        return null;
      }

      const nowSys: NowSysInserirPropostaResponse[] = [];
      const assistCard: AssistCardCompraResponse[] = [];
      const universalAssistance: UniversalAssistanceTravelCompraResponse[] = [];
      
      if (purchasesHybrid != null) {
        purchasesHybrid.forEach((purchase) => {
          const hybridQuote = JSON.parse(purchase.metadata) as NowSysInserirPropostaResponse;
          nowSys.push(hybridQuote);
        });
      }
      
      if (purchasesTravel != null) {
        purchasesTravel.forEach((purchase) => {
          if (purchase.provider == 'assistCard') {
            const assistCardQuote = JSON.parse(purchase.metadata) as AssistCardCompraResponse;
            assistCard.push(assistCardQuote);
          }
          else if (purchase.provider == 'universal') {
            const universalAssistanceQuote = JSON.parse(purchase.metadata) as UniversalAssistanceTravelCompraResponse;
            universalAssistance.push(universalAssistanceQuote);
          }
        });
      }

      const purchases: PurchasesResponse[] = [];

      nowSys.forEach((purchase) => {
        purchases.push({
          seguradora: 'nowSys',
          codigoProduto: purchase.proposta.dados_proposta[0].produto.codigo_produto,
          nomeProduto: purchase.proposta.dados_proposta[0].produto.nome_produto,
          dataInicio: purchase.proposta.dados_proposta[0].vigencia.data_inicio,
          dataFim: purchase.proposta.dados_proposta[0].vigencia.data_fim,
          dataEmissao: purchase.proposta.dados_proposta[0].dtemissao,
          numeroProposta: purchase.proposta.dados_proposta[0].propostaid.toString(),
          valorPremio: purchase.proposta.cobranca.parcelas_cobradas?.valor_recebido.toString(),
          segurado: {
            nome: purchase.proposta.segurado.nome,
            cpfCnpj: purchase.proposta.segurado.cpf_cnpj,
            endereco: {
              logradouro: purchase.proposta.segurado.endereco.logradouro,
              numero: purchase.proposta.segurado.endereco.numero,
              complemento: purchase.proposta.segurado.endereco.complemento,
              bairro: purchase.proposta.segurado.endereco.bairro,
              cidade: purchase.proposta.segurado.endereco.cidade,
              estado: purchase.proposta.segurado.endereco.siglaestado,
              cep: purchase.proposta.segurado.endereco.cep
            },
            contato: purchase.proposta.segurado.contato.map((contato) => {
              return {
                tipo: contato.tipo,
                descricao: contato.descricao
              };
            })
          },
        });
      });
      
      assistCard?.forEach((purchase) => {
        const item = purchasesTravel.find((item) => {
          const hybridQuote = JSON.parse(item.metadata) as AssistCardCompraResponse;
          return hybridQuote.EmissoesResponseAPI[0].VoucherGroup === purchase.EmissoesResponseAPI[0].VoucherGroup;
        });

        purchases.push({
          seguradora: 'assistCard',
          codigoProduto: purchase.EmissoesResponseAPI[0].Ratecode.toString(),
          nomeProduto: purchase.EmissoesResponseAPI[0].Productname,
          dataInicio: purchase.EmissoesResponseAPI[0].Begindate,
          dataFim: purchase.EmissoesResponseAPI[0].Enddate,
          dataEmissao: purchase.Emissiondate,
          numeroProposta: purchase.EmissoesResponseAPI[0].VoucherGroup,
          valorPremio: purchase.Totalamount.toString(),
          segurado: {
            nome: purchase.EmissoesResponseAPI[0].Name + ' ' + purchase.EmissoesResponseAPI[0].Lastname,
            cpfCnpj: purchase.EmissoesResponseAPI[0].Documentnumber,
            endereco: {
              logradouro: item.contato.address,
              numero: item.contato.number,
              complemento: null,
              bairro: item.contato.neighborhood,
              cidade: item.contato.city,
              estado: item.contato.uf,
              cep: item.contato.address
            },
            contato: [
              {
                tipo: 'email',
                descricao: item.contato.email
              },
              {
                tipo: 'celular',
                descricao: item.contato.cellPhone
              }
            ]
          },
        });
      });

      // universalAssistance.forEach((purchase) => {
      //   purchases.push({
      //     seguradora: 'universal'
      //   });
      // });

      return purchases;

    } catch (error) {
      console.error("Error fetching hybrid compras:", error);
      return null;
    }
  }
}

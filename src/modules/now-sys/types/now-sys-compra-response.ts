interface NowSysCompraResponse {
  EmissoesResponseAPI: EmissoesResponseAPI[];
  Totalamount: number;
}

interface EmissoesResponseAPI {
  Agency: string | null;
  Branch: number;
  VoucherCode: number;
  VoucherGroup: string;
  UrlEvoucher: string;
  Productcode: string;
  Productname: string | null;
  Ratecode: number;
  Begindate: string;
  Enddate: string;
  Days: number | null;
  FamilyPlan: boolean;
  Destination: number;
  Exchange: number;
  Cash: boolean;
  CurrencyCode: number;
  Creditcardid: number;
  Instalments: number;
  Name: string;
  Lastname: string;
  Documenttype: number;
  Documentnumber: string;
  Birthdate: string;
  Gender: string | null;
  Email: string | null;
  Phone: string | null;
  Contactfullname: string;
  Additionaldata1: string;
  Additionaldata2: string;
  Upgrades: any; // Tipo genérico, altere conforme necessário
  ExternalSellingId: string | null;
  linkImpressao: string;
}
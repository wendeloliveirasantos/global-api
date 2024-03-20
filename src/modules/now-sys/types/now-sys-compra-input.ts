export interface NowSysCompraInput {
  productcode: string;
  ratecode: number;
  departuredate: string;
  returndate: string;
  days: number;
  familyPlan: number;
  destiny: number;
  cash: boolean;
  creditcardid: number;
  creditcardcpf: string;
  creditcardname: string;
  creditcardnumber: string;
  expirationdate: string;
  cardholdername: string;
  CurrencyCode: number;
  instalments: number;
  contactfullname: string;
  contactphone: string;
  quotation: string;
  passengers: string;
  upgrades: string;
  markup: number;
  discount: number;
  sessiontoken: string;
  additionalInformation: string;
  isB2cProject: boolean;
  promotionalCode: number;
}

export interface Passageiro {
  name: string,
  lastname: string, 
  documentcountry: string,
  documenttype: number, 
  documentnumber: string, 
  birthdate: string, 
  gender: string, 
  email: string, 
  phone: string, 
  zipcode: string, 
  address: string, 
  number: string, 
  district: string, 
  complement: string, 
  city: string, 
  state: string, 
  contactfullname: string,
  contactphone: string, 
  additionaldata1: string, 
  additionaldata2: string, 
  upgrades: null
}
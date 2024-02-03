export interface AssistCardCoberturasInput {
  departuredate: string;
  returndate: string;
  Language: string;
  Exchang: number;
  passengers: Array<{ 
    birthdate: string 
  }>;
  destiny: number;
  sessiontoken: string;
  listproducts: Produto[];
}

export interface Produto {
  productCode: string;
  productRate: number
}
export interface NowSysCoberturasInput {
  departuredate: string;
  returndate: string;
  Language: string;
  Exchang: number;
  passengers: Array<{ 
    birthdate: string 
  }>;
  destiny: number;
  sessiontoken: string;
}

// export interface Produto {
//   productCode: string;
//   productRate: number
// }
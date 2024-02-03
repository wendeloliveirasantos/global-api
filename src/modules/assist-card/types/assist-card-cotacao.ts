export interface AssistCardCotacaoInput {
  departuredate: string;
  returndate: string;
  markup: number;
  birthdates: Array<{ 
    birthdate: string 
  }>;
  destiny: number;
  sessiontoken: string;
  isB2cProject: boolean;
  promotionalCode: string;
  isCreditCard: boolean;
}
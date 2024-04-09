import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';


export class HybridCompraDto {
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  productReferenceId: string;

  @IsObject()
  @IsNotEmptyObject()
  @IsNotEmpty()
  holder: {
    firstName: string;
    lastName: string;
    gender: string;
    companyName: string;
    cnpjNumber: string;
    cpfNumber: string;
    cellPhone: string;
    birthDate: string;
    email: string;
    address: string;
    number: string;
    city: string;
    neighborhood: string;
    uf: string;
    country: string;
    zipCode: string;
  };

  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  payment: {
    cardholderName: string;
    cardholderCPF: string;
    cardNumber: string;
    securityCode: string;
    expiryMonth: string;
    expiryYear: string;
    installments: number;
    operator: string;
  };
}

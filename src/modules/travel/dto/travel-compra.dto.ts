import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PassengerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;
}

export class TravelCompraDto {
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
    cpfNumber: string;
    cellPhone: string;
    birthDate: string;
    address: string;
    number: string;
    city: string;
    neighborhood: string;
    uf: string;
    country: string;
    zipCode: string;
  };

  @IsArray()
  @Type(() => PassengerDto)
  passengers: PassengerDto[];

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
  };
}

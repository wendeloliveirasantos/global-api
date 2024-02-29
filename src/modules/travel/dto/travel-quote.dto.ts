import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class PassengerDto {
  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty()
  birthDate: string;
}

export class TravelQuoteDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsNotEmpty()
  departureDate: string;

  @ApiProperty({ example: '2024-01-10' })
  @IsNotEmpty()
  returnDate: string;

  @ApiProperty({ example: '2024-01-10' })
  @IsNotEmpty()
  destiny: string;

  @ApiProperty({
    example: [{ birthDate: '1990-01-01' }, { birthDate: '1995-02-15' }],
    type: [PassengerDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  passengers: PassengerDto[];
  
  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  range: number;
}

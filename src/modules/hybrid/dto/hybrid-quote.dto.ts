import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsEmpty,
} from 'class-validator';

export class HybridQuoteDto {
  @ApiProperty({ example: 'Residencial' })
  @IsNotEmpty()
  business: string;
  
  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  range: number;

  @ApiProperty({ example: '1990-01-01' })
  @IsOptional()
  birthDate: string;
}

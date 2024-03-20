import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class HybridQuoteDto {
  @ApiProperty({ example: 'Residencial' })
  @IsNotEmpty()
  business: string;
  
  @ApiProperty({ example: 500 })
  @IsNotEmpty()
  range: number;
}

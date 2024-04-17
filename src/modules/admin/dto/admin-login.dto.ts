import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty
} from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username: string;
  
  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;
}

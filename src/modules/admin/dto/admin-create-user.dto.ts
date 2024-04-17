import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty
} from 'class-validator';

export class AdminCreateUserDto {
  @ApiProperty({ example: 'name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'email' })
  @IsNotEmpty()
  email: string;
}

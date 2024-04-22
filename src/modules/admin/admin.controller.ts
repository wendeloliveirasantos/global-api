import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { User } from '../user/schemas/user.schema';
import { AdminCreateUserResponse } from './types/admin-create-user-response';
import { TravelCompra } from '../travel/schemas/travel-compra';
import { HybridCompra } from '../hybrid/schemas/hybrid-compra';
import { NowSysCotacao } from '../now-sys/types/now-sys-response';
import { PurchasesResponse } from './types/purchases-response';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<{ accessToken: string }> {
    try {
      const token = await this.adminService.login(adminLoginDto);
      if (token) {
        return { accessToken: token };
      } else {
        throw new HttpException('Failed to login. Invalid credentials.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create-user')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponse> {
    return this.adminService.createUser(createUserDto);
  }

  @Get('list-purchases')
  @HttpCode(HttpStatus.OK)
  async listPurchases(): Promise<PurchasesResponse[]> {
    return this.adminService.listPurchases();
  }
}

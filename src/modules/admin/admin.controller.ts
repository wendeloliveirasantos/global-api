import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { User } from '../user/schemas/user.schema';
import { AdminCreateUserResponse } from './types/admin-create-user-response';

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
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<{ accessToken: string } | { message: string }> {
    const token = await this.adminService.login(adminLoginDto);
    if (token) {
      return { accessToken: token };
    } else {
      return { message: 'Failed to login. Invalid credentials.' };
    }
  }

  @Post('create-user')
  async createUser(@Body() createUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponse> {
    return this.adminService.createUser(createUserDto);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminCreateUserResponse } from './types/admin-create-user-response';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(AdminService.name);

  async login(adminLoginDto: AdminLoginDto): Promise<string | null> {
    return this.userService.login(adminLoginDto.username, adminLoginDto.password);
  }

  async createUser(adminCreateUserDto: AdminCreateUserDto): Promise<AdminCreateUserResponse> {
    const createdUser = await this.userService.createUser(adminCreateUserDto);
    return {
      name: createdUser.name,
      username: createdUser.username,
      email: createdUser.email,
    };
  }
}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    HttpModule, 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AdminController
  ],
  providers: [
    AdminService, 
    UserService
  ],
  exports: [
    AdminService, 
    UserService
  ],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { HybridCompra, HybridCompraSchema } from '../hybrid/schemas/hybrid-compra';
import { TravelCompra, TravelCompraSchema } from '../travel/schemas/travel-compra';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule,
    UserModule, 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TravelCompra.name, schema: TravelCompraSchema },
      { name: HybridCompra.name, schema: HybridCompraSchema },
    ])
  ],
  controllers: [
    AdminController
  ],
  providers: [
    AdminService
  ],
  exports: [
    AdminService
  ],
})
export class AdminModule {}

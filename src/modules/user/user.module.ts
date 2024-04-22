import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { AdminModule } from '../admin/admin.module';
import { HybridCompra, HybridCompraSchema } from '../hybrid/schemas/hybrid-compra';
import { HybridQuote, HybridQuoteSchema } from '../hybrid/schemas/hybrid-quote';
import { TravelCompra, TravelCompraSchema } from '../travel/schemas/travel-compra';
import { TravelQuote, TravelQuoteSchema } from '../travel/schemas/travel-quote';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ])
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

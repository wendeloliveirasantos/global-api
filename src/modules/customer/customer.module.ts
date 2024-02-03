import { Module } from '@nestjs/common';
import { UniversalAssistanceModule } from '../universal-assistance/universal-assistance.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerService } from './customer.service';
import { AssistCardModule } from '../assist-card/assist-card.module';
import { OutSideModule } from '../outside/outside.module';

@Module({
  imports: [
    UniversalAssistanceModule,
    AssistCardModule,
    OutSideModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}

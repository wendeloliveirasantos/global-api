import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { UniversalAssistanceModule } from '../universal-assistance/universal-assistance.module';
import { TravelController } from './travel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelQuote, TravelQuoteSchema } from './schemas/travel-quote';
import { CustomerModule } from '../customer/customer.module';
import { TravelCompra, TravelCompraSchema } from './schemas/travel-compra';
import { AssistCardModule } from '../assist-card/assist-card.module';
import { OutSideModule } from '../outside/outside.module';

@Module({
  imports: [
    CustomerModule,
    UniversalAssistanceModule,
    AssistCardModule,
    OutSideModule,
    MongooseModule.forFeature([
      { name: TravelQuote.name, schema: TravelQuoteSchema },
      { name: TravelCompra.name, schema: TravelCompraSchema },
    ]),
  ],
  controllers: [TravelController],
  providers: [TravelService],
  exports: [TravelService],
})
export class TravelModule {}

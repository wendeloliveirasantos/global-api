import { Module } from '@nestjs/common';
import { HybridService } from './hybrid.service';
import { HybridController } from './hybrid.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HybridQuote, HybridQuoteSchema } from './schemas/hybrid-quote';
import { CustomerModule } from '../customer/customer.module';
import { HybridCompra, HybridCompraSchema } from './schemas/hybrid-compra';
import { OutSideModule } from '../outside/outside.module';
import { NowSysModule } from '../now-sys/now-sys.module';

@Module({
  imports: [
    CustomerModule,
    NowSysModule,
    OutSideModule,
    MongooseModule.forFeature([
      { name: HybridQuote.name, schema: HybridQuoteSchema },
      { name: HybridCompra.name, schema: HybridCompraSchema },
    ]),
  ],
  controllers: [HybridController],
  providers: [HybridService],
  exports: [HybridService],
})
export class HybridModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import universalAssistanceTravelConfig from './config/universal-assistance-travel.config';
import { UniversalAssistanceModule } from './modules/universal-assistance/universal-assistance.module';
import { TravelModule } from './modules/travel/travel.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './modules/customer/customer.module';
import assistCardConfig from './config/assist-card.config';
import { AssistCardModule } from './modules/assist-card/assist-card.module';
import { OutSideModule } from './modules/outside/outside.module';
import nowSysConfig from './config/now-sys.config';
import { NowSysModule } from './modules/now-sys/now-sys.module';
import { HybridModule } from './modules/hybrid/hybrid.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, universalAssistanceTravelConfig, assistCardConfig, nowSysConfig]
    }),
    MongooseModule.forRoot('mongodb://root:p1Hh7P0juRB0OIsZlxfyaHZwq9ncOqGOCJwggxyOzkwXYXsfT4xmAstzmp9kjL42@92.113.33.10:5432/global?authSource=admin&directConnection=true'),
    UniversalAssistanceModule,
    AssistCardModule,
    NowSysModule,
    HybridModule,
    TravelModule,
    CustomerModule,
    OutSideModule,
    AdminModule,
    UserModule
  ],
})
export class AppModule {}
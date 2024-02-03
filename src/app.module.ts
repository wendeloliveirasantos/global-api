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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, universalAssistanceTravelConfig, assistCardConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UniversalAssistanceModule,
    AssistCardModule,
    TravelModule,
    CustomerModule,
    OutSideModule
  ],
})
export class AppModule {}

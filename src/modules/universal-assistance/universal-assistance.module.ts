import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UniversalAssistanceTravelService } from './universal-assistance-travel.service';

@Module({
  imports: [HttpModule],
  providers: [UniversalAssistanceTravelService],
  exports: [UniversalAssistanceTravelService],
})
export class UniversalAssistanceModule {}

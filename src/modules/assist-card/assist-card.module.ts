import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AssistCardService } from './assist-card.service';

@Module({
  imports: [HttpModule],
  providers: [AssistCardService],
  exports: [AssistCardService],
})
export class AssistCardModule {}

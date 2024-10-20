import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SendGridService } from './sendgrid.service';
import { SendGridController } from './sendgrid.controller';

@Module({
  imports: [HttpModule],
  controllers: [SendGridController],
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}

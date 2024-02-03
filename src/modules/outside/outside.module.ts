import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutSideService } from './outside.service';

@Module({
  imports: [HttpModule],
  providers: [OutSideService],
  exports: [OutSideService],
})
export class OutSideModule {}

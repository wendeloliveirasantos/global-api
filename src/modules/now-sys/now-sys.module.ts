import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NowSysService } from './now-sys.service';

@Module({
  imports: [HttpModule],
  providers: [NowSysService],
  exports: [NowSysService],
})
export class NowSysModule {}

import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [SmsService],
  exports: [SmsService],
  imports: [HttpModule],
})
export class SmsModule {}

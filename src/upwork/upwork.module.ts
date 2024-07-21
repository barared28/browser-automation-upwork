import { Module } from '@nestjs/common';
import { UpworkService } from './upwork.service';
import { SmsModule } from '../sms/sms.module';
import { EmailModule } from '../email/email.module';

@Module({
  providers: [UpworkService],
  exports: [UpworkService],
  imports: [SmsModule, EmailModule],
})
export class UpworkModule {}

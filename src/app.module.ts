import { Module } from '@nestjs/common';
import { SignupModule } from './signup/signup.module';
import { UpworkModule } from './upwork/upwork.module';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [SignupModule, UpworkModule, SmsModule, EmailModule],
})
export class AppModule {}

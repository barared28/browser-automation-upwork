import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UpworkModule } from '../upwork/upwork.module';

@Module({
  controllers: [SignupController],
  providers: [SignupService],
  imports: [UpworkModule],
})
export class SignupModule {}

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [HttpModule],
})
export class EmailModule {}

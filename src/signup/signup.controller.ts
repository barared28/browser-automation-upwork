import { Body, Controller, Post } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupDto } from './dto/signup.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('bulk')
  async signupBulk(@Body() payload: SignupDto) {
    try {
      const users = payload.users;
      (async () => {
        for (const user of users) {
          await this.signupService.createUser(user);
        }
      })();
      return {
        success: true,
        message: 'Signup Quequed',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

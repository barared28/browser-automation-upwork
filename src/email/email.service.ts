import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async verifyEmail(email: string) {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.retool.com/v1/workflows/5ddd8d59-61d8-4f65-8d4e-9933a8cb2769/startTrigger',
        {
          email,
          // last one hour
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
        {
          headers: {
            'X-Workflow-Api-Key': 'retool_wk_25cfcfad84604939b58c49477fd62fca',
          },
        },
      );
      const emailText = response.data?.data?.plain;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = emailText.match(urlRegex);
      let verificationLink;
      if (urls) {
        verificationLink = urls.find((url) => url.includes('/verify-email'));
      }
      console.log('Verification Link:', verificationLink);
      return verificationLink;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

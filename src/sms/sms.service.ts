import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Country } from '../signup/dto/signup.dto';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import { waitForSecs } from '../utils';
dotenv.config();

@Injectable()
export class SmsService {
  constructor(private readonly httpService: HttpService) {}

  async getPhoneNumberForVerification(country: Country) {
    try {
      let country_res = '';
      let country_code = '';
      let product = 'upwork';
      switch (country) {
        case Country.Indonesia:
          country_res = 'indonesia';
          country_code = '+62';
          break;
        case Country.United_States:
          country_res = 'usa';
          country_code = '+1';
          break;
        case Country.United_Kingdom:
          country_res = 'england';
          country_code = '+44';
          break;
        case Country.Canada:
          country_res = 'canada';
          country_code = '+1';
          product = 'other';
          break;
        case Country.Ukraine:
          country_res = 'ukraine';
          country_code = '+380';
          break;
      }
      const response = await this.httpService.axiosRef.get(
        `https://5sim.net/v1/user/buy/activation/${country_res}/any/${product}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY_SMS}`,
          },
        },
      );
      const data = response.data;
      const phone_number_raw = data?.phone;
      const phone_number = phone_number_raw?.replace(country_code, '');
      const verification_id = data?.id;
      return {
        phone_number,
        verification_id,
      };
    } catch (error) {
      throw error;
    }
  }

  async getVerificationCode(id: string) {
    try {
      let code = '';
      const time = moment();
      while (!code && time.isBefore(moment().add(20, 'minutes'))) {
        console.log('Waiting for verification code...');
        const response = await this.httpService.axiosRef.get(
          `https://5sim.net/v1/user/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY_SMS}`,
            },
          },
        );
        const data = response.data;
        const sms = data?.sms || [];
        if (sms.length > 0) {
          code = sms[0]?.code;
        }
        await waitForSecs(10);
      }
      return code;
    } catch (error) {
      throw error;
    }
  }
}

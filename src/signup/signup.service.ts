import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import { UpworkService } from '../upwork/upwork.service';
import { User } from './dto/signup.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

@Injectable()
export class SignupService {
  constructor(private readonly upworkService: UpworkService) {}

  async createUser(user: User) {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: './temp/' + new Date().getTime(),
      // args: ['--proxy-server=res.proxy-seller.com:10000'],
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1024 });
      await this.upworkService.signup(page, user);
      await this.upworkService.verifyEmail(page, user);
      await this.upworkService.getStarted(page);
      const stepTitleElement = await page.$('a[class="air3-list-nav-link"]');
      const isMethodOne = stepTitleElement !== null;
      if (isMethodOne) {
        await this.upworkService.createProfileMethodOne(page, user);
      } else {
        await this.upworkService.createProfileMethodTwo(page, user);
      }
    } catch (error) {
      throw error;
    } finally {
      await browser.close();
    }
  }
}

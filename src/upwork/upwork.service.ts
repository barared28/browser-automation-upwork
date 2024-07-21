import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { clickElement, inputElement, waitForSecs } from '../utils';
import { Country, User } from '../signup/dto/signup.dto';
import * as moment from 'moment';
import { SmsService } from '../sms/sms.service';
import * as path from 'path';
import { EmailService } from '../email/email.service';

@Injectable()
export class UpworkService {
  constructor(
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
  ) {}

  async signup(page: Page, user: User) {
    try {
      await page.goto('https://www.upwork.com/nx/signup', {
        waitUntil: 'domcontentloaded',
      });
      await clickElement(page, 'input[value="work"]', 1);
      await clickElement(page, '[data-qa="btn-apply"]', 1);
      await inputElement(page, '#first-name-input', user?.first);
      await inputElement(page, '#last-name-input', user?.last);
      await inputElement(page, '#redesigned-input-email', user?.email);
      await inputElement(page, '#password-input', user?.password);
      await clickElement(page, 'div[aria-labelledby="select-a-country"]', 1);
      await inputElement(page, 'input[type="search"]', user?.country);
      await clickElement(page, '[data-ev-label="menu_item"]', 1);
      await page.waitForSelector('[data-test="checkbox-input"]');
      const checkboxs = await page.$$('[data-test="checkbox-input"]');
      if (checkboxs?.length > 1) {
        await checkboxs[1].click();
      }
      await waitForSecs(1);
      await clickElement(page, '#button-submit-form', 1);
    } catch (error) {
      throw error;
    }
  }

  async getStarted(page: Page) {
    try {
      await clickElement(page, '[data-qa="get-started-btn"]', 1);
      await clickElement(page, 'input[value="FREELANCED_BEFORE"]', 1);
      await clickElement(page, '[data-test="next-button"]', 1);
      await clickElement(page, 'input[value="EXPLORING"]', 1);
      await clickElement(page, '[data-test="next-button"]', 1);
      await clickElement(page, 'input[aria-labelledby="button-box-24"]', 1);
      await clickElement(page, '[data-test="next-button"]', 4);
      await clickElement(page, '[data-qa="resume-fill-manually-btn"]', 1);
    } catch (error) {
      throw error;
    }
  }

  async createProfileMethodOne(page: Page, user: User) {
    try {
      await clickElement(page, 'li[class="air3-list-nav-item mb-3x"]', 1);
      await clickElement(page, '[data-test="checkbox-label"]', 1);
      await clickElement(page, '[data-test="next-button"]', 3);
      await clickElement(page, '[aria-labelledby="skills-input"]', 1);
      await inputElement(page, '[aria-labelledby="skills-input"]', 'Software');
      await clickElement(page, 'li[role="option"]', 1);
      await clickElement(page, '[data-test="next-button"]', 3);
      await this.createProfileRoleTitle(page, user);
      await this.createProfileExperience(page, user);
      await this.createProfileEducation(page, user);
      await this.createProfileLanguages(page, user);
      await this.createProfileDescriptionOverview(page, user);
      await this.createProfileRates(page, user);
      await this.createProfileInputInformation(page, user);
    } catch (error) {
      throw error;
    }
  }

  async createProfileMethodTwo(page: Page, user: User) {
    try {
      await this.createProfileRoleTitle(page, user);
      await this.createProfileExperience(page, user);
      await this.createProfileEducation(page, user);
      await this.createProfileLanguages(page, user);
      await clickElement(page, 'div[role="button"]', 1);
      await clickElement(page, 'div[role="button"]', 1);
      await clickElement(page, 'div[role="button"]', 1);
      await clickElement(page, '[data-test="next-button"]', 3);
      await this.createProfileDescriptionOverview(page, user);
      await clickElement(page, '[data-qa="category-add-btn"]', 1);
      await clickElement(page, '[data-test="next-button"]', 3);
      await this.createProfileRates(page, user);
      await this.createProfileInputInformation(page, user);
    } catch (error) {
      throw error;
    }
  }

  async createProfileRoleTitle(page: Page, user: User) {
    try {
      await inputElement(
        page,
        'input[aria-labelledby="title-label"]',
        user?.role_title,
      );
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async createProfileInputInformation(page: Page, user: User) {
    try {
      let formatDate = 'YYYY-MM-DD';
      if (user?.country === Country.United_States) {
        formatDate = 'MM/DD/YYYY';
      }
      console.log(formatDate, 'formatDate');
      await inputElement(
        page,
        'input[aria-labelledby="date-of-birth-label"]',
        moment(user?.birth_date).format(formatDate),
      );
      if (user?.country === Country.Indonesia) {
        await inputElement(
          page,
          'input[aria-labelledby="street-label"]',
          user?.address,
        );
        await clickElement(page, 'input[aria-labelledby="city-label"]', 1);
        await inputElement(
          page,
          'input[aria-labelledby="city-label"]',
          user?.city,
        );
        await clickElement(page, 'li[role="option"]', 1);
        await inputElement(
          page,
          '[data-ev-label="phone_number_input"]',
          user?.phone_number,
        );
      } else if (
        user?.country === Country.United_States ||
        user?.country === Country.United_Kingdom
      ) {
        await clickElement(page, '[data-qa="input-address"]', 1);
        await page.keyboard.type(user?.address || '');
        await waitForSecs(2);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await waitForSecs(1);
        const { phone_number, verification_id } =
          await this.smsService.getPhoneNumberForVerification(user?.country);
        await clickElement(page, 'input[type="tel"]', 1);
        await page.keyboard.type(phone_number || '', {
          delay: 100,
        });
        await waitForSecs(1);
        const captcha = await page.$('[id="phone-recaptcha"]');
        if (captcha) {
          await clickElement(page, '[id="phone-recaptcha"]', 2);
          await waitForSecs(20);
        }
        await clickElement(page, '[data-qa="pv-go-to-enter-code-btn"]', 3);
        const code = await this.smsService.getVerificationCode(verification_id);
        await clickElement(page, 'input[class="vue-pincode-input"]');
        await page.keyboard.type(code || '');
        await waitForSecs(2);
        await clickElement(page, '[data-qa="pv-verify-btn"]', 3);
      } else if (
        user?.country === Country.Canada ||
        user?.country === Country.Ukraine
      ) {
        await inputElement(
          page,
          'input[aria-labelledby="street-label"]',
          user?.address,
        );
        await clickElement(page, 'input[aria-labelledby="city-label"]', 1);
        await inputElement(
          page,
          'input[aria-labelledby="city-label"]',
          user?.city,
        );
        await clickElement(page, 'li[role="option"]', 1);
        await inputElement(page, '[data-qa="zip"]', user?.zip_code);
        await inputElement(
          page,
          '[data-ev-label="phone_number_input"]',
          user?.phone_number,
        );
      }

      await clickElement(page, '[data-qa="open-loader"]', 3);
      const input: any = await page.$('[data-ev-label="image_crop_input"]');
      const image = path.join(__dirname, '../../images.jpg');
      await input?.uploadFile(image);
      await waitForSecs(3);
      await clickElement(page, '[data-qa="btn-save"]', 5);
      await clickElement(page, '[data-test="next-button"]', 3);
      await clickElement(page, '[data-qa="submit-profile-bottom-btn"]', 3);
      const browse_jobs = await page.$('[href="/nx/find-work/best-matches/"]');
      if (browse_jobs) {
        await clickElement(page, '[href="/nx/find-work/best-matches/"]', 3);
      } else {
        await clickElement(page, '[data-test="skip"]', 3);
      }
      await waitForSecs(5);
    } catch (error) {
      throw error;
    }
  }

  async createProfileExperience(page: Page, user: User) {
    try {
      for (const experience of user?.experience) {
        await clickElement(page, '[data-qa="employment-add-btn"]', 3);
        await page.waitForSelector('[data-ev-sublocation="!modal"]');
        const inputs = await page.$$('input');
        for (const input of inputs) {
          const id = await input.evaluate((el) => el?.id);
          console.log(id, 'id');
        }
        await clickElement(page, 'div[class="air3-typeahead-fake"]', 2);
        await page.keyboard.type(experience?.role_title);
        await page.keyboard.press('Enter');
        await clickElement(page, 'div[class="air3-typeahead-fake"]', 2);
        await page.keyboard.type(experience?.company);
        await page.keyboard.press('Enter');
        await inputElement(
          page,
          'input[aria-labelledby="location-label"]',
          experience?.location,
        );
        await clickElement(page, '[data-test="checkbox-input"]', 1);
        await clickElement(page, 'div[aria-labelledby="start-date-month"]', 1);
        await page.keyboard.press('ArrowDown');
        await waitForSecs(1);
        await page.keyboard.press('Enter');
        await clickElement(page, 'div[aria-labelledby="start-date-year"]', 1);
        await page.keyboard.type(experience?.start_year?.toString() || '');
        await page.keyboard.press('ArrowDown');
        await waitForSecs(1);
        await page.keyboard.press('Enter');
        await clickElement(page, '[data-qa="btn-save"]', 5);
      }
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async createProfileEducation(page: Page, user: User) {
    try {
      for (const education of user?.education) {
        await clickElement(page, '[data-qa="education-add-btn"]', 1);
        await inputElement(
          page,
          'input[aria-labelledby="school-label"]',
          education?.school_label,
        );
        await page.keyboard.press('Enter');
        await inputElement(
          page,
          'input[aria-labelledby="degree-label"]',
          education?.degree_label,
        );
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await inputElement(
          page,
          'input[aria-labelledby="area-of-study-label"]',
          education?.area_of_study_label,
        );
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        const [startDate, endDate] = await page.$$(
          'div[aria-labelledby="dates-attended-label"]',
        );
        startDate.click();
        await waitForSecs(2);
        await page.keyboard.type(education?.dates_attended_label_start || '');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        endDate.click();
        await waitForSecs(2);
        await page.keyboard.type(education?.dates_attended_label_end || '');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await waitForSecs(1);
        await clickElement(page, '[data-qa="btn-save"]', 3);
      }
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async createProfileLanguages(page: Page, user: User) {
    try {
      const languages = user?.languages;
      const findEnglish = languages?.find(
        (language) => language?.language?.toLowerCase() === 'english',
      );
      const levelEnglish = findEnglish?.level || 0;
      await clickElement(page, '[aria-labelledby="dropdown-label-english"]', 1);
      const levelsEnglish = await page.$$('span[data-ev-label="menu_item"]');
      if (levelsEnglish?.length > 0) {
        await levelsEnglish[levelEnglish].click();
      }
      const languageWithoutEnglish = languages?.filter(
        (language) => language?.language?.toLowerCase() !== 'english',
      );
      for (const language of languageWithoutEnglish) {
        await clickElement(page, '[data-qa="languages-btn-add"]', 1);
        await clickElement(
          page,
          'div[aria-labelledby="dropdown-label-language-0"]',
          1,
        );
        await page.keyboard.type(language?.language || '');
        await waitForSecs(1);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await clickElement(
          page,
          'div[aria-labelledby="dropdown-label-proficiency-0"]',
          1,
        );
        const levels = await page.$$('span[data-ev-label="menu_item"]');
        if (levels?.length > 0) {
          await levels[language?.level || 0].click();
        }
      }
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async createProfileDescriptionOverview(page: Page, user: User) {
    try {
      await inputElement(
        page,
        'textarea[aria-describedby="overview-counter"]',
        user?.description,
      );
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async createProfileRates(page: Page, user: User) {
    try {
      await inputElement(
        page,
        '[data-test="currency-input"]',
        String(user?.rate),
      );
      await clickElement(page, '[data-test="next-button"]', 3);
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(page: Page, user: User) {
    try {
      await waitForSecs(15);
      const verificationLink = await this.emailService.verifyEmail(user.email);
      await page.goto(verificationLink, { waitUntil: 'domcontentloaded' });
      await waitForSecs(10);
    } catch (error) {
      throw error;
    }
  }
}

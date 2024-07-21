import { Page } from 'puppeteer';

export const waitForSecs = (secs: number) =>
  new Promise((resolve) => setTimeout(resolve, secs * 1000));

export const waitFindElement = async (page: Page, selector: string) => {
  const element = await page.$(selector);
  const isExist = element !== null;

  if (!isExist) {
    await waitForSecs(1);
    const element = await page.$(selector);
    const isExist = element !== null;
    return isExist;
  }

  return isExist;
};

export const clickElement = async (
  page: Page,
  selector: string,
  waitSecs?: number,
) => {
  await page.locator(selector).click();

  if (waitSecs) {
    await waitForSecs(waitSecs);
  }
};

export const inputElement = async (
  page: Page,
  selector: string,
  text: string,
) => {
  await page.locator(selector).fill(text);

  await waitForSecs(1);
};

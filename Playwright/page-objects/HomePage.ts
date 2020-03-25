import { Page } from 'playwright';

import { PageObject } from './PageObject';

const COOKIE_ACCEPT_BUTTON_FRAGMENT = 'I accept';
const SUBSCRIPTION_SUCCESS_MESSAGE = 'You are subscribed!';

export class HomePage extends PageObject {
  constructor(page: Page) {
    super(page);
  }

  getCareersLink() {
    return this.selectByText('careers');
  }

  async acceptCookies() {
    const button = await this.page.$(`//button[contains(string(), '${COOKIE_ACCEPT_BUTTON_FRAGMENT}')]`);

    if (button) {
      await button.click();
    }
  };

  async subscribeToNewsletterAs(email: string) {
    const input = await this.page.$(`//footer//form//input[@type='email']`);
    const button = await this.page.$(`//footer//form//button[@type='submit']`);
    await input.type(email);
    await button.click();
  }

  async getSubscriptionSuccessMessage() {
    return this.page.waitForSelector(`//span[contains(string(), '${SUBSCRIPTION_SUCCESS_MESSAGE}')]`);
  }
}

import { Selector, t } from 'testcafe';

const COOKIE_ACCEPT_BUTTON_FRAGMENT = 'I accept';
const SUBSCRIPTION_SUCCESS_MESSAGE = 'You are subscribed!';

export class HomePage {
  $careersLink = Selector('a').withText('Careers');
  $newsletterInput = Selector('footer form input[type="email"]');
  $newsletterSubmitButton = Selector('footer form button[type="submit"]');
  $subscriptionSuccessMessage = Selector('span').withText(SUBSCRIPTION_SUCCESS_MESSAGE);
  $acceptCookiesButton = Selector('button', { timeout: 200 }).withText(COOKIE_ACCEPT_BUTTON_FRAGMENT);

  async clickCareersLink() {
    await t.click(this.$careersLink);
  }

  async subscribeToNewsletterAs(email: string) {
    await t.click(this.$newsletterInput);
    await t.typeText(this.$newsletterInput, email);
    await t.click(this.$newsletterSubmitButton);
  }

  async acceptCookies() {
    const isCookieNotificationVisible = await this.$acceptCookiesButton.exists;

    if (isCookieNotificationVisible) {
      await t.click(this.$acceptCookiesButton);
    }
  }
}

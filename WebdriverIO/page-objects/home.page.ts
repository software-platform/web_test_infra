import { Page } from './Page';

const COOKIE_ACCEPT_BUTTON_FRAGMENT = 'I accept';
const SUBSCRIPTION_SUCCESS_MESSAGE = 'You are subscribed!';

class Homepage extends Page {
  open() {
    super.open('https://robinhood.com');
  }

  get careersLink() {
    return $(`//footer//a[contains(string(), 'Careers')]`);
  }

  get subscriptionSuccessMessage() {
    return $(`//span[contains(string(), '${SUBSCRIPTION_SUCCESS_MESSAGE}')]`);
  }

  get acceptCookiesButton() {
    return $(`//button[contains(string(), '${COOKIE_ACCEPT_BUTTON_FRAGMENT}')]`);
  }

  acceptCookies() {
    this.acceptCookiesButton.click();
  }

  subscribeToNewsletterAs(email: string) {
    const input = $(`//footer//form//input[@type='email']`);
    input.click();
    input.setValue(email);

    const button = $(`//footer//form//button[@type='submit']`);
    button.click();
  }
}

export const homepage = new Homepage();

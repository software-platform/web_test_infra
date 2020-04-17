import { homepage } from 'page-objects/home.page';

describe('Newsletter subscription', () => {
  it('Happy path', () => {
    homepage.open();

    try {
      homepage.acceptCookies();
    } catch {}

    homepage.subscribeToNewsletterAs('rh.test.user@mailinator.com');
    homepage.subscriptionSuccessMessage.waitForExist();

    browser.saveScreenshot('./newsletter-subscription.png');
  });
});

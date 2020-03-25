import { Selector, t } from 'testcafe';

const ABOUT_THE_COMPANY_FRAGMENT = 'Robinhood is democratizing our financial system. With customers at the heart of our decisions, Robinhood is lowering barriers, removing fees, and providing greater access to financial information.';

export class JobDetailsPage {
  $header = Selector('#header h1');
  $aboutTheCompany = Selector('p').withText(ABOUT_THE_COMPANY_FRAGMENT);
  $focusedInput = Selector('input:focus');
  $submitButton = Selector('input[type="button"]').withAttribute('value','Submit Application');
  $errorMessage = Selector('.field-error-msg');

  async fillInputWithLabel(label: string, text: string) {
    await t.click(Selector('label').withText(label));
    return t.typeText(this.$focusedInput, text);
  }

  getErrorMessage(text: string) {
    return this.$errorMessage.withText(text);
  }

  submit() {
    return t.click(this.$submitButton);
  }
}

import { Selector, t } from 'testcafe';

export class JobDetailsPage {
  $header = Selector('#header h1');
  $aboutTheCompany = Selector('p').withText('About the company');
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

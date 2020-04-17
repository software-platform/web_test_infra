const { I } = inject();

const ABOUT_THE_COMPANY_FRAGMENT = 'About the company';
const SUBMIT_BUTTON_LABEL = 'Submit Application';


export class JobDetailsPage {
  iframe = '#grnhse_iframe';
  aboutCompany = ABOUT_THE_COMPANY_FRAGMENT;

  getErrorMessage = (text: string) => locate('.field-error-msg').withText(text);

  fillInputByLabel(label: string, value: string) {
    I.fillField(`//div[label[contains(.,'${label}')]]/input`, value);
  }

  submit() {
    I.click(SUBMIT_BUTTON_LABEL);
  }
}

const jobDetailsPage = new JobDetailsPage();

module.exports = jobDetailsPage;

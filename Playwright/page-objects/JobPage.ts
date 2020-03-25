import { Page, Frame } from 'playwright';

import { PageObject } from './PageObject';

const GREENHOUSE_IFRAME_SELECTOR = '#grnhse_iframe';
const ABOUT_THE_COMPANY_FRAGMENT = 'Robinhood is democratizing our financial system. With customers at the heart of our decisions, Robinhood is lowering barriers, removing fees, and providing greater access to financial information.';
const SUBMIT_BUTTON_LABEL = 'Submit Application';

export class JobPage extends PageObject {
  greenhouseIFrame: Frame;

  constructor(page: Page) {
    super(page);
  }

  async grabIFrame() {
    const handle = await this.page.$(GREENHOUSE_IFRAME_SELECTOR);
    this.greenhouseIFrame = await handle.contentFrame();
  }

  getHeader = () => this.greenhouseIFrame.$eval('h1', el => el.textContent);

  getAboutCompany = () => this.greenhouseIFrame.$(`//p[contains(string(), '${ABOUT_THE_COMPANY_FRAGMENT}')]`);

  fillInputWithLabel = async (label: string, text: string) => {
    const labelElement = await this.greenhouseIFrame.$(`//label[contains(string(), '${label}')]`);
    await labelElement.click();
    const input = await this.greenhouseIFrame.evaluateHandle(() => document.activeElement);

    return input.type(text);
  };

  submit = () => this.greenhouseIFrame.$(`//input[@value = '${SUBMIT_BUTTON_LABEL}']`).then(el => el.click());

  getErrorMessage = (text: string) => this.greenhouseIFrame.$(`//*[@class = 'field-error-msg' and contains(string(), '${text}')]`);
}

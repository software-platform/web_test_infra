import { Page } from './Page';

const GREENHOUSE_IFRAME_SELECTOR = '#grnhse_iframe';

class JobDetailsPage extends Page {
  open() {
    super.open('https://careers.robinhood.com/openings?gh_jid=2137513');
  }
}

class JobDetailsPageIFrame extends Page {
  get header() {
    return $('h1.app-title');
  }

  get iframe() {
    return $(GREENHOUSE_IFRAME_SELECTOR);
  }

  enter() {
    browser.switchToFrame(this.iframe);
  }

  fillInputByLabel(label: string, text: string) {
    const input = $(`//div[label[contains(string(), '${label}')]]/input`);
    input.click();
    input.setValue(text);
  }

  getErrorMessageByText(text: string) {
    return $(`//div[@class='field-error-msg' and contains(.,'${text}')]`);
  }

  submit() {
    $(`//input[@value='Submit Application']`).click();
  }
}

export const jobDetailsPage = new JobDetailsPage();
export const jobDetailsPageIFrame = new JobDetailsPageIFrame();

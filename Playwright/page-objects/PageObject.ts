import { Page } from 'playwright';

import { escapeRegex } from '../helpers';

// NOTE: This is a weak attempt at extracting common functionality from page objects.
//       I can imagine this getting more useful in time, but here it's more of
//       a proof-of-concept than anything else.
export class PageObject {
  constructor(public page: Page) {}

  selectByText(text: string) {
    return this.page.$(`text=/${escapeRegex(text)}/i`);
  }

  waitForNetwork() {
    return this.page.waitForLoadState({ waitUntil: 'networkidle0' });
  }
}

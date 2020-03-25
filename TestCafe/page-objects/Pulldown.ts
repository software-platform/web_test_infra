import { Selector, t } from 'testcafe';

export class Pulldown {
  $wrapper: Selector;
  $options: Selector;

  constructor(cssSelector: string) {
    this.$wrapper = Selector(cssSelector);
    this.$options = this.$wrapper.find('option');
  }

  async getOptions() {
    const options: string[] = [];
    const count = await this.$options.count;

    for (let i = 0; i< count; i++) {
      options.push(await this.$options.nth(i).textContent);
    }

    return options;
  }

  clickOption(text: string) {
    return t
      .click(this.$wrapper)
      .click(this.$options.withText(text));
  }
}

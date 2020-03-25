import playwright, { Browser, Page, BrowserContext } from 'playwright';

import { HomePage } from '../page-objects/HomePage';

jest.setTimeout(60000);

describe('Newsletter subscription (with PollyJS)', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeAll(async () => {
    browser = await playwright.chromium.launch({ headless: true });

    // NOTE: We need to bypass CSP to run eval() on the injected polly-injectable.js script.
    context = await browser.newContext({ bypassCSP: true });

    // NOTE: Main PollyJS script. This allows us to patch regular request APIs with PollyJS equivalents.
    await context.addInitScript({
      path: './Polly/build/polly-injectable.js',
    });

    // NOTE: Script that configures and runs PollyJS with page- or test-specific parameters.
    await context.addInitScript({
      content: `
        window.polly = new Polly('robinhood', {
          adapters: ['fetch', 'xhr'],
          persister: 'rest',
        });

        window.polly.configure({
          recordFailedRequests: true,
          persisterOptions: {
            keepUnusedRequests: true,
            rest: {
              host: 'http://localhost:4000'
            }
          },
        });

        const { server } = window.polly;

        server
          .get('/google-analytics/*path')
          .intercept((req, res) => res.sendStatus(200));
       `,
    });

    page = await context.newPage();
  });

  afterAll(async () => {
    // NOTE: `window.polly.stop()` has to be called if we want PollyJS to actually save the session data.
    //       If this is omitted, PollyJS server keeps the data in memory and does not seem to flush it to
    //       disk when issued a ^C.

    // TODO: Double check PollyJS server graceful shutdown / data persistence.
    //       Maybe check other types of persistence layer?

    await page.evaluate(`window.polly.stop()`);
    await browser.close();
  });

  test('Happy path', async () => {
    const homepage = new HomePage(page);

    await page.goto('https://robinhood.com', { waitUntil: 'networkidle0' });
    await homepage.acceptCookies();
    await homepage.subscribeToNewsletterAs('writhe@mailinator.com');

    // TEST: Success message appears
    expect(await homepage.getSubscriptionSuccessMessage()).toBeTruthy();
  });
});

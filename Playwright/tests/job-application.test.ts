import playwright, { Browser } from 'playwright';

import { HomePage } from '../page-objects/HomePage';
import { CareersPage } from '../page-objects/CareersPage';
import { JobPage } from '../page-objects/JobPage';

// NOTE: This can and probably should be configured globally, but maybe not while debugging test scripts.
jest.setTimeout(60000);

// NOTE: In this example, Jest's `describe` block is used to group scenarios.
//       Typically, the scenarios would consist of all the different paths a user would take while using
//       the functionality we're trying to cover with the test. Here, we only have the "almost happy path"
//       It's successful up until the form-filling-and-submitting part, where I decided not to abuse the server
//       so the test ends by failing the client-side pre-validation.
describe('Job application', () => {
  let browser: Browser;

  beforeAll(async () => {
    // NOTE: `true` is the default value for `headless` option, but is not omitted here for ease of debugging.
    // browser = await playwright.webkit.launch({ headless: true });

    // NOTE: The code below should, but does not work with any PAAS I know of and it does
    //       not look like it's the service's fault. The last known (to me) version of Playwright
    //       that connects to these services was 0.9, but back then the key was "browserWSEndpoint" (just like in Puppeteer)

    // const browser = await playwright.chromium.connect({
    //   wsEndpoint: 'wss://chrome.browserless.io',
    // });

    // const browser = await playwright.chromium.connect({
    //   wsEndpoint: 'wss://chrome.headlesstesting.com?token=1C75F5F0218B6BAC22&browserVersion=dev',
    // });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Job application - happy path', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const homepage = new HomePage(page);

    await page.goto('https://robinhood.com', { waitUntil: 'networkidle0' });

    const careersLink = await homepage.getCareersLink();

    // TEST: "Careers" link exists
    expect(careersLink).toBeTruthy();

    await careersLink.click();

    const careersPage = new CareersPage(page);

    await careersPage.waitForNetwork();

    // TEST: Fine print exists
    expect(await careersPage.getFinePrint()).toBeTruthy();

    await careersPage.grabIFrame();

    // TEST: List header is immediately visible
    expect(await careersPage.getHeader()).toBeTruthy();

    await careersPage.chooseLocation('66322'); // Denver, CO

    const allJobsCount = (await careersPage.getOffers()).length;
    const correctJobsCount = (await careersPage.getOffersWithText('Denver, CO')).length;

    // TEST: Total number of offers matches the number of offers containing chosen location
    expect(allJobsCount).toBe(correctJobsCount);

    const jobTitle = await careersPage.getJobOfferTitle(0);
    await careersPage.chooseJobOffer(0);

    const jobPage = new JobPage(page);

    await jobPage.grabIFrame();

    // TEST: Header matches the job description we've just clicked
    expect(await jobPage.getHeader()).toEqual(jobTitle);

    // TEST: "About the company" paragraph exists
    expect(await jobPage.getAboutCompany()).toBeTruthy();

    await jobPage.fillInputWithLabel('First Name', 'Test');
    await jobPage.fillInputWithLabel('Last Name', 'User');
    await jobPage.fillInputWithLabel('Email', 'not.actually.an.email');
    await jobPage.submit();

    // TEST: Error message appears
    expect(await jobPage.getErrorMessage('Please use the format "text@example.com"'));
  });
});

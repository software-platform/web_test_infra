const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS); // Yeah, this does not work.

exports.config = {
  tests: './tests/*.test.ts',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost',
      show: !process.env.HEADLESS,
      browser: 'webkit',
    },
  },
  include: {
    homepage: './page-objects/home.page.ts',
    careersPage: './page-objects/careers.page.ts',
    jobDetailsPage: './page-objects/jobDetails.page.ts',
  },
  bootstrap: null,
  mocha: {},
  name: 'codecept',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
  },
  require: ['ts-node/register'],
};

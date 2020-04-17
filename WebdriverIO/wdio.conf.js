exports.config = {
  automationProtocol: 'devtools',
  runner: 'local',
  specs: ['./tests/**/*.test.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    // NOTE: Uncomment this to run tests against FF Nightly.
    //       Job application test will fail - my guess is FF devtools support does not cover switching to iframes.
    // {
    //   maxInstances: 5,
    //   browserName: 'firefox',
    //   'moz:firefoxOptions': {
    //     binary: '/Applications/Firefox Nightly.app/Contents/MacOS/firefox-bin',
    //     headless: false,
    //   }
    // },
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: process.env.HEADLESS ? ['--headless', '--disable-gpu'] : [],
      }
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    require: 'ts-node/register',
    compilers: ['tsconfig-paths/register'],
  },
};

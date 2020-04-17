exports.config = {
  // NOTE: There is a helper function in webdriverio/packages/wdio-config/src/utils.js
  //       that detects (some) backend services by their username format :|
  //       That's why, in case of BrowserStack or Sauce Labs we don't have to specify host, port nor path.
  user: 'filip.moroz',
  key: '4d1b0869-9497-4172-a2e5-8afbbfd78c7d',
  specs: ['./tests/**/*.test.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      build: 'SauceLabs-WebdriverIO-Chrome',
      name: 'Test suite 01',
      browserName: 'safari',
      browserVersion: '12.0',
      platformName: 'macOS 10.14',
      'sauce:options': {
        screenResolution: '1024x768',
      },
    },
    // {
    //   build: 'SauceLabs-WebdriverIO-Safari',
    //   name: 'Test suite 01',
    //   browserName: 'chrome',
    //   browserVersion: '40.0',
    //   platformName: 'macOS 10.14',
    //   'sauce:options': {
    //     screenResolution: '1024x768',
    //   },
    // },
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

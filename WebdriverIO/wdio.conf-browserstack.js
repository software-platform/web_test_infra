exports.config = {
  // NOTE: There is a helper function in webdriverio/packages/wdio-config/src/utils.js
  //       that detects (some) backend services by their username format :|
  //       That's why, in case of BrowserStack or Sauce Labs we don't have to specify host, port nor path.
  user: 'filipmoroz1',
  key: 'XQVpzAYHxpgDLPx9zpfg',
  specs: ['./tests/**/*.test.ts'],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      'os': 'OS X',
      'os_version': 'Mojave',
      'browser': 'Safari',
      'browser_version': '12.0',
      'resolution': '1024x768',
    },
    {
      'os': 'OS X',
      'os_version': 'Mojave',
      'browser': 'Chrome',
      'browser_version': '80',
      'resolution': '1024x768',
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

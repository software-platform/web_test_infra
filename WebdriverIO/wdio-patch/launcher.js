"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = launch;

var _chromeLauncher = require("chrome-launcher");

var _puppeteerCore = _interopRequireDefault(require("puppeteer-core"));

var _logger = _interopRequireDefault(require("@wdio/logger"));

var _edge = _interopRequireDefault(require("./finder/edge"));

var _firefox = _interopRequireDefault(require("./finder/firefox"));

var _utils = require("./utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const log = (0, _logger.default)('devtools');

async function launchChrome(capabilities) {
  const chromeOptions = capabilities['goog:chromeOptions'] || {};
  const chromeFlags = [..._constants.DEFAULT_FLAGS, ...[`--window-position=${_constants.DEFAULT_X_POSITION},${_constants.DEFAULT_Y_POSITION}`, `--window-size=${_constants.DEFAULT_WIDTH},${_constants.DEFAULT_HEIGHT}`], ...(chromeOptions.headless ? ['--headless', '--no-sandbox'] : []), ...(chromeOptions.args || [])];
  log.info(`Launch Google Chrome with flags: ${chromeFlags.join(' ')}`);
  const chrome = await (0, _chromeLauncher.launch)({
    chromePath: chromeOptions.binary,
    chromeFlags
  });
  log.info(`Connect Puppeteer with browser on port ${chrome.port}`);
  const browser = await _puppeteerCore.default.connect(_objectSpread({}, chromeOptions, {
    browserURL: `http://localhost:${chrome.port}`,
    defaultViewport: null
  }));
  const pages = await (0, _utils.getPages)(browser);

  for (const page of pages.slice(0, -1)) {
    if (page.url() === 'about:blank') {
      await page.close();
    }
  }

  return browser;
}

function launchBrowser(capabilities, executablePath, vendorCapKey) {
  const puppeteerOptions = Object.assign({
    executablePath,
    defaultViewport: {
      width: _constants.DEFAULT_WIDTH,
      height: _constants.DEFAULT_HEIGHT
    }
  }, capabilities[vendorCapKey] || {});

  if (!executablePath) {
    throw new Error('Couldn\'t find executeable for browser');
  }

  log.info(`Launch ${executablePath} with config: ${JSON.stringify(puppeteerOptions)}`);
  return _puppeteerCore.default.launch(puppeteerOptions);
}

function launchFirefox(capabilities) {
  const vendorPrefix = 'moz:firefoxOptions';

  if (!capabilities[vendorPrefix]) {
    capabilities[vendorPrefix] = {};
  }

  const executablePath = capabilities[vendorPrefix].binary || _firefox.default[process.platform]()[0];

  capabilities[vendorPrefix].product = 'firefox';
  return launchBrowser(capabilities, executablePath, vendorPrefix, {
    product: 'firefox'
  });
}

function launchEdge(capabilities) {
  const executablePath = _edge.default[process.platform]()[0];

  return launchBrowser(capabilities, executablePath, 'ms:edgeOptions');
}

function launch(capabilities) {
  const browserName = capabilities.browserName.toLowerCase();

  if (_constants.CHROME_NAMES.includes(browserName)) {
    return launchChrome(capabilities);
  }

  if (_constants.FIREFOX_NAMES.includes(browserName)) {
    return launchFirefox(capabilities);
  }

  if (_constants.EDGE_NAMES.includes(browserName)) {
    return launchEdge(capabilities);
  }

  throw new Error(`Couldn't identify browserName ${browserName}`);
}

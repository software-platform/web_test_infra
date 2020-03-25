const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/polly-injectable.js'),
  output: {
    filename: 'polly-injectable.js',
    path: path.resolve(__dirname, 'build'),
  },
};

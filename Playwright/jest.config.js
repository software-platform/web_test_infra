module.exports = {
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: ['**.test.ts'],
  transform: {
    '^.+\\.ts(x)?$': 'ts-jest'
  },
  testTimeout: 10000,
  verbose: true,
};

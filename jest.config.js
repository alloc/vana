module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testEnvironment: 'node',
  testRegex: '\\.spec\\.[^.]+$',
  transform: {
    '\\.(js|jsx|ts|tsx)$': '@sucrase/jest-plugin',
  },
}

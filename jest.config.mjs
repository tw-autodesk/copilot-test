/** @type {import('ts-jest').JestConfigWithTsJest} */

// const ignoredModules = [].join('|');

const configs = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': './babel-jest.mjs',
  },
  // transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${ignoredModules})/)`],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
};

export default configs;

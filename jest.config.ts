import { Config } from '@umijs/test';
import baseConfig from './jest.config.base';

const config: Config.InitialOptions = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  projects: ['<rootDir>/packages/*/jest.config.ts'],
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage/',
};

export default config;

import { Config, createConfig } from '@umijs/test';
import path from 'path';

const base: Config.InitialOptions = createConfig({
  jsTransformer: 'esbuild',
  target: 'node',
});

delete base.testTimeout;

const config: Config.InitialOptions = {
  ...base,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '@ims-view/hooks': '<rootDir>/packages/hooks/src',
    '@ims-view/utils': '<rootDir>/packages/utils/src',
  },
  rootDir: path.resolve(__dirname, '.'),
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/es/'],
};

export default config;

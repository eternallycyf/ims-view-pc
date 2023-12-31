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
    '@ims-view/chart': '<rootDir>/packages/chart/src',
    'ims-view-pc': '<rootDir>/packages/ims-view-pc/src',
    // fix: iconfont报错
    '../../styles/iconfont/iconfont.js':
      '<rootDir>/packages/ims-view-pc/src/components/AccessBtn/index.tsx',
  },
  rootDir: path.resolve(__dirname, '.'),
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/es/'],
};

export default config;

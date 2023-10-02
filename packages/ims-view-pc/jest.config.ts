import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = 'ims-view-pc';

const root = '<rootDir>/packages/ims-view-pc';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

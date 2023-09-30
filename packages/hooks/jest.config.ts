import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = '@ims-view/hooks';

const root = '<rootDir>/packages/hooks';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

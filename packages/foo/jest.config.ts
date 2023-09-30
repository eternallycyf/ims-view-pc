import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = '@ims-view/foo';

const root = '<rootDir>/packages/foo';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

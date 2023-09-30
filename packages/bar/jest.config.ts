import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = '@ims-view/bar';

const root = '<rootDir>/packages/bar';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

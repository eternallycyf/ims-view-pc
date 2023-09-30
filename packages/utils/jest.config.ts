import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = '@ims-view/utils';

const root = '<rootDir>/packages/utils';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

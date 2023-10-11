import { Config } from '@umijs/test';
import base from '../../jest.config.base';

const packageName = '@ims-view/chart';

const root = '<rootDir>/packages/chart';

const config: Config.InitialOptions = {
  ...base,
  rootDir: '../..',
  roots: [root],
  displayName: packageName,
};

export default config;

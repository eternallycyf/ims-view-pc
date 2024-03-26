import { defineConfig } from 'father';

export default defineConfig({
  cjs: { output: 'lib', platform: 'browser' },
  esm: { output: 'es' },
  extraBabelPlugins: ['add-module-exports'],
});

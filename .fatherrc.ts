import { defineConfig } from 'father';

export default defineConfig({
  cjs: { output: 'lib', platform: 'browser' },
  esm: { output: 'es' },
  umd: { output: 'dist' },
  extraBabelPlugins: ['add-module-exports'],
});

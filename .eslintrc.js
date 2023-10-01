const config = require('@umijs/max/eslint');

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
  },
};

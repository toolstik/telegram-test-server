const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
  extends: './../.eslintrc.js',
};

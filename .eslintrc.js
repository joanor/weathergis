module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    'no-unreachable': 'off',
    'no-redeclare': 'off',
    'no-extra-semi': 'off',
    'no-undef': 'off',
  },
}

module.exports = {
  env: {
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    project: null,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'key-spacing': 'off',
    'no-undef': 'off',
    'no-return-await': 'error',
    'spaced-comment': 'off',
    'array-callback-return': 'off',
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      {
        allowArgumentsExplicitlyTypedAsAny: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowedNames: [],
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}

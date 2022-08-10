module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto',
    },
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: '*.spec.ts',
      rules: {
        'max-lines-per-function': 'off',
        'max-nested-callbacks': 'off',
      },
    },
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    '@typescript-eslint/semi': ['error'],
    'max-lines-per-function': ['warn', 25],
    'no-param-reassign': ['error', { props: false }],
    'max-lines': ['warn', 400],
    'max-len': ['error', { code: 120, ignorePattern: '^import .*' }],
    complexity: ['error', 5],
    'max-nested-callbacks': ['error', 2],
    'max-params': ['warn', 3],
    'max-depth': ['error', 4],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-console': 'warn',
    useTabs: 0,
    'no-return-await': 'error',
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
  },
};

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-max-props-per-line': [2, { "maximum": 1, "when": "always" }],
    'no-multi-spaces': 'error',
    'react/jsx-tag-spacing': [
      'error',
      {
        'beforeSelfClosing': 'always'
      }
    ],
    'indent': [2, 'tab'],
    'no-tabs': 0,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-equals-spacing': 'error',
		'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
		'no-trailing-spaces': 'error',
		'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-indent': [2, 'tab'],
    'react/jsx-indent-props': [2, 'tab'],
  },
}

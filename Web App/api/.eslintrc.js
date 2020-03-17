module.exports = {
  parser: 'babel-eslint',
  extends: ['standard'],
  plugins: ['simple-import-sort'],
  rules: {
    'max-len': ['error', {
      code: 80,
      ignorePattern: '^import [^,]+ from |^export '
    }],
    'simple-import-sort/sort': 'error',
    'sort-imports': 0,
    'import/order': 0
  },
  overrides: [
    {
      files: '*.test.js',
      env: { jest: true }
    }
  ]
}

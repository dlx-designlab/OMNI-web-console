module.exports = {
  parser: 'babel-eslint',
  extends: ['standard', 'standard-react'],
  plugins: ['simple-import-sort'],
  rules: {
    'max-len': ['error', {
      code: 80,
      ignorePattern: '^import [^,]+ from |^export '
    }],
    'simple-import-sort/sort': ['error', {
      groups: [
        // Default: Side effect imports.
        ['^\\u0000'],
        // Default: Packages. Things that start with a letter (or digit or
        // underscore), or `@` followed by a letter.
        ['^@?\\w'],
        // Material-UI packages.
        ['^(@material-ui)(/.*|$)'],
        // Default: Relative imports. Anything that starts with a dot.
        ['^\\.'],
        // Style imports.
        ['^.+\\.s?css$']
      ]
    }],
    'sort-imports': 0,
    'import/order': 0,
    'react/prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/jsx-fragments': 0
  },
  overrides: [
    {
      files: '*.test.{js,jsx}',
      env: { jest: true }
    }
  ]
}

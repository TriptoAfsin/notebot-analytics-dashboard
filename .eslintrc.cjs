module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  // src/components/evilcharts is vendored in from the Evil Charts registry via
  // `shadcn add` — it is third-party code we re-pull rather than hand-maintain,
  // so it is excluded from our lint rules.
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/components/evilcharts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": "warn",
  },
}

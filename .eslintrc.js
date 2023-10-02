module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard-with-typescript',
    'prettier'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json']
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ["jest-extended"],
  rules: {
  }
}

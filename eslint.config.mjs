import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import eslintPluginN from 'eslint-plugin-n';

export default tseslint.config(
  eslintPluginN.configs['flat/recommended'],
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    rules: {
      'n/hashbang': [
        'error',
        {
          additionalExecutables: ['src/index.ts'],
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    files: ['**/*.ts'],
  },
);

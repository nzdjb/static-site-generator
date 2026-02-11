import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import eslintPluginN from 'eslint-plugin-n';

export default defineConfig([
  eslintPluginN.configs['flat/recommended'],
  eslint.configs.recommended,
  tseslint.configs.recommended,
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
        projectService: true,
      },
    },
    files: ['**/*.ts'],
  },
]);

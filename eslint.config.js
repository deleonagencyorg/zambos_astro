import js from '@eslint/js';
import pluginAstro from 'eslint-plugin-astro';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...pluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: pluginAstro.parser,
      parserOptions: {
        parser: typescriptParser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-unreachable': 'off',
      'no-empty': 'off',
      'no-constant-binary-expression': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        // Browser globals
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        IntersectionObserver: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        NodeListOf: 'readonly',
        Element: 'readonly',
        requestAnimationFrame: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        File: 'readonly',
        FormData: 'readonly',
        // Node.js globals
        process: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        // External libraries
        Swiper: 'readonly',
        useMutation: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
    },
  },
  {
    ignores: ['**/._*', '**/.DS_Store'],
  },
  {
    rules: {
      'no-parsing-error': 'off',
      'no-empty': 'off',
      'parser-error': 'off',
    },
  },
  prettierConfig,
];

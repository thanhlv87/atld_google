import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'functions/**',
      'public/sw.js',
      'tailwind.config.js',
      '*.config.js',
      '*.config.ts',
      'vite.config.ts',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React-specific config
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      // React hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript - relaxed for existing codebase
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // General - relaxed
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
    },
  },

  // Node.js scripts
  {
    files: ['scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Files that use process.env
  {
    files: ['services/firebaseConfig.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },

  // Prettier must be last to override conflicting rules
  eslintConfigPrettier
);

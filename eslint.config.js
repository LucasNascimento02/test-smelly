import js from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly'
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...jestPlugin.configs.style.rules,
      'jest/no-conditional-in-test': 'error',
      'jest/no-test-return-statement': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/prefer-to-be': 'warn',
      'jest/prefer-expect-assertions': 'off',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals
      }
    }
  }
];


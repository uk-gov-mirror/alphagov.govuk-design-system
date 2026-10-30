import { fileURLToPath } from 'url'

import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import jsdoc from 'eslint-plugin-jsdoc'
import node from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import markdown from '@eslint/markdown'

const gitignorePath = [fileURLToPath(new URL('.gitignore', import.meta.url))]

export default defineConfig([
  {
    extends: [prettier]
  },
  globalIgnores([
    // Enable dotfile linting
    '!.*'
  ]),
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    files: [
      '**/*.{cjs,js,mjs}',

      // Check markdown `*.md` contains valid code blocks
      // https://github.com/eslint/eslint-plugin-markdown#advanced-configuration
      '**/*.md/*.{cjs,js,mjs}'
    ],
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest' }
    },
    extends: [
      importX.flatConfigs.recommended,
      jsdoc.configs['flat/recommended-typescript-flavor'],
      node.configs['flat/recommended'],
      promise.configs['flat/recommended'],
      js.configs.recommended,
      prettier
    ],
    rules: {
      // Check import or require statements are A-Z ordered
      'import-x/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          'newlines-between': 'always'
        }
      ],

      // JSDoc blocks are optional by default
      'jsdoc/require-jsdoc': 'off',

      // Check for valid formatting
      'jsdoc/check-line-alignment': [
        'warn',
        'never',
        {
          wrapIndent: '  '
        }
      ],

      // Add unknown @jest-environment tag name
      'jsdoc/check-tag-names': [
        'warn',
        {
          definedTags: ['jest-environment']
        }
      ],

      // Require hyphens before param description
      // Aligns with TSDoc style: https://tsdoc.org/pages/tags/param/
      'jsdoc/require-hyphen-before-param-description': 'warn',

      // Maintain new line after description
      'jsdoc/tag-lines': [
        'warn',
        'never',
        {
          startLines: 1
        }
      ],

      // Automatically use template strings
      'no-useless-concat': 'error',
      'prefer-template': 'error',

      'no-unused-vars': ['error', { args: 'none' }],
      'no-redeclare': ['error', { builtinGlobals: false }]
    },
    settings: {
      jsdoc: {
        // Allows us to use type declarations that exist in our dependencies
        mode: 'typescript'
      }
    }
  },
  {
    // Extensions required for ESM import
    files: ['**/*.mjs'],
    rules: {
      'import-x/extensions': [
        'error',
        'always',
        {
          ignorePackages: true,
          pattern: {
            cjs: 'always',
            js: 'always',
            mjs: 'always'
          }
        }
      ]
    }
  },
  {
    files: ['**/*.test.{cjs,js,mjs}'],
    languageOptions: {
      globals: {
        page: 'readonly',
        browser: 'readonly',
        jestPuppeteer: 'readonly',
        ...globals.jest,
        ...globals.browser
      }
    }
  },
  {
    files: ['**/*.md'],
    extends: [markdown.configs.recommended],
    processor: 'markdown/markdown'
  },
  {
    // Assume markdown `*.md` JavaScript code blocks use browser globals
    files: ['**/*.md/*.{cjs,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  }
])

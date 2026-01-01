import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "warn",
      'react/jsx-uses-react': 'off', // Or 'error' depending on your preference
      'react/jsx-uses-vars': 'off', // Or 'error'
    }
  },
  {
    rules: {
      "no-unused-vars": "warn",
      'react/jsx-uses-react': 'off', // Or 'error' depending on your preference
      'react/jsx-uses-vars': 'off', // Or 'error'
    }
  }
])

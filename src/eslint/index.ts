/**
 * @nannantown/ground-ui ESLint plugin
 *
 * Provides lint rules that enforce GroundUI design principles.
 *
 * Usage (eslint.config.js — flat config):
 *
 *   import groundUi from '@nannantown/ground-ui/eslint'
 *
 *   export default [
 *     groundUi.configs.recommended,
 *     // …your other configs
 *   ]
 *
 * Or pick individual rules:
 *
 *   export default [
 *     {
 *       plugins: { 'ground-ui': groundUi },
 *       rules: { 'ground-ui/no-emoji': 'error' },
 *     },
 *   ]
 */

import noEmoji from './no-emoji'

const plugin = {
  meta: {
    name: '@nannantown/ground-ui',
    version: '0.1.1',
  },
  rules: {
    'no-emoji': noEmoji,
  },
  configs: {} as Record<string, unknown>,
}

// Self-referencing config (ESLint flat config pattern)
plugin.configs.recommended = {
  plugins: {
    'ground-ui': plugin,
  },
  rules: {
    'ground-ui/no-emoji': 'error',
  },
}

export default plugin

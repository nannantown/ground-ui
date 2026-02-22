import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import groundUi from './dist/eslint/index.js'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  groundUi.configs.recommended,
  {
    ignores: ['dist/', 'out/', 'node_modules/', 'catalog/'],
  },
)

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'theme/index': 'src/theme/index.ts',
    'interactions/index': 'src/interactions/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next-themes'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})

import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Library build. Two entries: the component barrel (`.`) and the stylesheet
// (`./styles.css`). Components never import CSS themselves — consumers import
// `@droppy/design-system/styles.css` once — so the JS stays side-effect free
// and tree-shakes.
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx'],
      rollupTypes: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    // Library mode would otherwise fold every stylesheet into one file keyed to
    // the JS entry; the stylesheet is its own entry here so it can be imported
    // on its own.
    cssCodeSplit: true,
    lib: {
      entry: {
        index: entry('src/index.ts'),
        styles: entry('src/styles/index.css'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Everything the consumer already has (React, Base UI) stays external so
      // there is exactly one instance of each in the app — Base UI's portals
      // and context break with duplicates.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@base-ui\/react($|\/)/],
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})

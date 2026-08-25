import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Library build. Two entries: the component barrel (`.`) and the stylesheet
// (`./styles.css`). Components never import CSS themselves — consumers import
// `@droppy-ui/design-system/styles.css` once — so the JS stays side-effect free
// and tree-shakes.
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx'],
      rollupTypes: true,
      bundledPackages: ['@base-ui/react'],
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
      // React and react-dom stay external so there is exactly one instance of
      // each in the consumer app. Base UI is bundled into the output instead —
      // it never appears in the consumer's dependency graph, and the copy
      // shipped inside this package is the only instance that exists.
      // use-sync-external-store (a CJS transitive of Base UI) must also stay
      // external: bundled, its `require("react")` cannot be rewritten against
      // external react and survives as a runtime `require` that browsers
      // don't have. As a regular dependency the consumer's bundler converts
      // it where react is internal.
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^use-sync-external-store($|\/)/],
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})

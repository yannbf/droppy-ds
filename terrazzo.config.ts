import { defineConfig } from '@terrazzo/parser'
import css from '@terrazzo/plugin-css'

const DARK_ATTR = ":root[data-ds-theme='dark']"
const MEDIA_SCOPE = ":root:not([data-ds-theme='light'], [data-ds-theme='dark'])"

export default defineConfig(
  {
    tokens: ['./src/theme/tokens/resolver.json'],
    outDir: './src/theme/',
    plugins: [
      css({
        filename: 'tokens.css',
        legacyHex: false,
        // @property definitions are off until plugin-css stops emitting
        // `initial-value: var(...)` for alias tokens — invalid per spec,
        // and lightningcss rejects the stylesheet during the library build.
        propertyDefinitions: false,
        permutations: [
          { input: { theme: 'light' }, prepare: (c) => `:root {\n${c}\n}` },
          { input: { theme: 'dark' }, prepare: (c) => `${DARK_ATTR} {\n${c}\n}` },
          {
            input: { theme: 'dark' },
            prepare: (c) => `@media (prefers-color-scheme: dark) {\n${MEDIA_SCOPE} {\n${c}\n}\n}`,
          },
        ],
      }),
    ],
  },
  {
    cwd: new URL(import.meta.url),
  }
)

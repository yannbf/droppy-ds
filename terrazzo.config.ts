import { defineConfig } from '@terrazzo/parser'
import css from '@terrazzo/plugin-css'

function dsVarName(id: string): string {
  const path = id.split('.')
  if (path[0] === 'color' && path[1] === 'palette') {
    return '--ds-palette-' + path.slice(2).join('-')
  }
  return '--ds-' + path.join('-')
}

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
        propertyDefinitions: true,
        variableName: (token) => dsVarName(token.id),
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
    cwd: import.meta.url,
  }
)

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { defineConfig } from '@terrazzo/parser'
import css from '@terrazzo/plugin-css'
import { transformCSSValue } from '@terrazzo/token-tools/css'

// ---------------------------------------------------------------------------
// Naming: color.palette.X.Y -> --ds-palette-X-Y (the "color" segment is
// dropped for palette primitives only); every other path -> --ds- + the
// dot-path with dots as dashes.
// ---------------------------------------------------------------------------
function dsVarName(id) {
  const path = id.split('.')
  if (path[0] === 'color' && path[1] === 'palette') {
    return '--ds-palette-' + path.slice(2).join('-')
  }
  return '--ds-' + path.join('-')
}

function shadowHasAlias(value) {
  const layers = Array.isArray(value) ? value : [value]
  return layers.some((layer) => typeof layer.color === 'string' && layer.color.startsWith('{'))
}

// Two departures from Terrazzo's default formatting:
// - type.tracking.default is the CSS `normal` keyword, which DTCG can't type
//   as a dimension; the typography styles hold it as a string literal, and
//   Terrazzo's dimension formatter renders that as `undefinedundefined`.
// - shadow.lift/overlay carry a non-integer alpha (0.08) that legacyHex would
//   round; only those two opt out of hex output to keep the exact alpha.
function transform(token, options) {
  if (token.$type === 'typography') {
    const value = transformCSSValue(token, options)
    if (value && typeof value === 'object' && value['letter-spacing'] === 'undefinedundefined') {
      value['letter-spacing'] = 'normal'
    }
    return value
  }
  if (token.$type === 'shadow' && !shadowHasAlias(token.$value)) {
    return transformCSSValue(token, { ...options, color: { ...options.color, legacyHex: false } })
  }
  return undefined
}

const DARK_ATTR = ":root[data-ds-theme='dark']"
const MEDIA_SCOPE = ':root:not([data-ds-theme=\'light\'], [data-ds-theme=\'dark\'])'

// ---------------------------------------------------------------------------
// tokens.ts — the `@droppy/design-system/tokens` module. Reads the CSS the
// css plugin just emitted (so both artifacts always carry identical values),
// resolves every var() alias to its literal per theme, and writes one typed
// entry per custom property, keyed by token id (typography composites get
// one entry per sub-property plus `.font` for the shorthand).
// ---------------------------------------------------------------------------
const TYPOGRAPHY_FIELDS = [
  ['fontFamily', '-font-family'],
  ['fontSize', '-font-size'],
  ['fontWeight', '-font-weight'],
  ['lineHeight', '-line-height'],
  ['letterSpacing', '-letter-spacing'],
]

const TOKENS_TS_HEADER = `/*
 * Design tokens as data — GENERATED FILE, do not hand-edit.
 * Run \`npm run build:tokens\` to regenerate alongside tokens.css; both carry
 * the same Terrazzo-formatted values, so a JS consumer and the stylesheet can
 * never disagree. Published as \`@droppy/design-system/tokens\`.
 *
 * One entry per token id. \`css\` is the custom-property name the stylesheet
 * defines; \`light\`/\`dark\` are the fully resolved CSS values per theme —
 * aliases are chased down to literals, and \`dark\` appears only where the
 * themes end up differing. Composite typography tokens are flattened into
 * one entry per sub-property plus a \`.font\` shorthand entry.
 * Prefer \`cssVar(id)\` in app styles — it follows the active theme by
 * construction; reach for the literal values only where a CSS variable
 * cannot go (canvas, email, JS color math).
 */`

function extractDeclarations(cssText, selector) {
  const start = cssText.indexOf(selector)
  if (start === -1) throw new Error(`tokens.ts plugin: selector not found: ${selector}`)
  const braceOpen = cssText.indexOf('{', start)
  let depth = 0
  let i = braceOpen
  for (; i < cssText.length; i++) {
    if (cssText[i] === '{') depth++
    else if (cssText[i] === '}') {
      depth--
      if (depth === 0) break
    }
  }
  const values = new Map()
  for (const m of cssText.slice(braceOpen + 1, i).matchAll(/^\s*(--[\w-]+):\s*(.+);\s*$/gm)) {
    values.set(m[1], m[2])
  }
  return values
}

function tokensTsPlugin() {
  return {
    name: 'droppy/tokens-ts',
    async buildEnd({ tokens, outputFiles }) {
      const cssFile = outputFiles.find((f) => f.filename === 'tokens.css')
      if (!cssFile) throw new Error('tokens.ts plugin: tokens.css not among output files')
      const lightValues = extractDeclarations(cssFile.contents, ':root {')
      const darkValues = extractDeclarations(cssFile.contents, `${DARK_ATTR} {`)

      const VAR_REF = /var\((--[\w-]+)\)/g
      function resolve(value, mode, depth = 0) {
        if (depth > 8) throw new Error(`Alias chain too deep while resolving: ${value}`)
        if (!value.includes('var(--')) return value
        const next = value.replace(VAR_REF, (_, name) => {
          const target = (mode === 'dark' && darkValues.get(name)) || lightValues.get(name)
          if (target === undefined) throw new Error(`Unresolvable var ${name} in ${value}`)
          return target
        })
        return resolve(next, mode, depth + 1)
      }

      const lines = []
      for (const [id, token] of Object.entries(tokens)) {
        const bare = dsVarName(id)
        const names =
          token.$type === 'typography'
            ? [...TYPOGRAPHY_FIELDS.map(([field, suffix]) => [`${id}.${field}`, bare + suffix]), [`${id}.font`, bare]]
            : [[id, bare]]
        for (const [key, name] of names) {
          if (!lightValues.has(name)) throw new Error(`tokens.ts plugin: ${name} missing from :root`)
          const light = resolve(lightValues.get(name), 'light')
          const dark = resolve(darkValues.get(name) ?? lightValues.get(name), 'dark')
          const entry = { css: name, light, ...(dark !== light ? { dark } : {}) }
          lines.push(`  '${key}': ${JSON.stringify(entry)},`)
        }
      }

      const out = `${TOKENS_TS_HEADER}

export const tokens = {
${lines.join('\n')}
} as const

export type TokenId = keyof typeof tokens

/** A \`var()\` reference to a token's custom property — follows the active theme. */
export const cssVar = (id: TokenId): string => \`var(\${tokens[id].css})\`
`
      writeFileSync(fileURLToPath(new URL('./src/theme/tokens.ts', import.meta.url)), out)
    },
  }
}

export default defineConfig({
  tokens: ['./src/theme/tokens/resolver.json'],
  outDir: './src/theme/',
  // core/valid-dimension flags the literal `normal` letterSpacing as a legacy
  // string dimension. It's a string-typed value deliberately inlined into a
  // dimension slot (see `transform` above), so the rule is off.
  lint: { rules: { 'core/valid-dimension': 'off' } },
  plugins: [
    css({
      filename: 'tokens.css',
      legacyHex: true,
      variableName: (token) => dsVarName(token.id),
      transform,
      permutations: [
        { input: { theme: 'light' }, prepare: (c) => `:root {\n${c}\n}` },
        { input: { theme: 'dark' }, prepare: (c) => `${DARK_ATTR} {\n${c}\n}` },
        {
          input: { theme: 'dark' },
          prepare: (c) => `@media (prefers-color-scheme: dark) {\n${MEDIA_SCOPE} {\n${c}\n}\n}`,
        },
      ],
    }),
    tokensTsPlugin(),
  ],
})

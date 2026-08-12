import { defineSwatchbookConfig } from '@unpunnyfuns/swatchbook-core'

export default defineSwatchbookConfig({
  tokens: ['src/theme/tokens/base.json'],
  axes: [
    {
      name: 'theme',
      contexts: { light: [], dark: ['src/theme/tokens/dark.json'] },
      default: 'light',
    },
  ],
  cssVarPrefix: 'ds',
})

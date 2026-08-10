import * as React from 'react'
import { definePreview } from '@storybook/react-vite'
import type { Decorator } from '@storybook/react-vite'
import addonDocs from '@storybook/addon-docs'
import addonA11y from '@storybook/addon-a11y'
import addonVitest from '@storybook/addon-vitest'
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon'

import '../src/styles/index.css'

// Droppy flips on `data-theme` on the root element, with the OS preference as
// the fallback. Storybook's toolbar drives the same attribute so what you see
// here is what the app gets.
const ThemedStory = ({ theme, children }: { theme: string; children: React.ReactNode }) => {
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.body.style.backgroundColor = 'var(--ds-color-surface-page)'
    document.body.style.color = 'var(--ds-color-text-primary)'
  }, [theme])

  return <>{children}</>
}

const withTheme: Decorator = (Story, context) => (
  <ThemedStory theme={context.globals.theme as string}>
    <Story />
  </ThemedStory>
)

const preview = definePreview({
  // Factory-style preview composes ONLY the addons listed here — the addons
  // array in main.ts contributes manager/preset halves, not preview
  // annotations. Every addon with a preview side must appear in this list, or
  // its annotations silently vanish: addon-docs' entry is what provides
  // `parameters.docs.renderer`, without which every docs page throws
  // `renderer is not a function` at runtime while the build stays green.
  addons: [addonDocs(), addonA11y(), addonVitest(), swatchbookAddon()],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Droppy colour scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { codePanel: true },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Technical guidelines',
          'Accessibility guidelines',
          'Brand guidelines',
          'Choosing components',
          'Component browser (Live)',
          'Component browser (Icons)',
          'Design tokens',
          'Actions',
          'Forms & input',
          'Navigation',
          'Layout & structure',
          'Feedback & status',
          'Overlays',
          'Typography',
          'Media & content',
        ],
      },
    },
  },
})

export default preview

import React from 'react'
import { definePreview } from '@storybook/react-vite'
import addonDocs from '@storybook/addon-docs'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import type { DocsContainerProps } from '@storybook/addon-docs/blocks'
import addonA11y from '@storybook/addon-a11y'
import addonVitest from '@storybook/addon-vitest'
import addonSwatchbook from '@unpunnyfuns/swatchbook-addon'

import '../src/styles/index.css'

// Docs pages with no story never run the decorator above, and without an
// explicit `data-theme` the stylesheet's `prefers-color-scheme` fallback kicks
// in — the container stamps the light theme before first paint instead.
const LightDocsContainer = (props: React.PropsWithChildren<DocsContainerProps>) => {
  React.useLayoutEffect(() => {
    document.documentElement.dataset.theme = 'light'
  })
  return <DocsContainer {...props} />
}

const preview = definePreview({
  addons: [addonDocs(), addonA11y(), addonVitest(), addonSwatchbook()],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { codePanel: true, toc: { headingSelector: 'h2, h3, h4' }, container: LightDocsContainer },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Technical guidelines',
          'Accessibility guidelines',
          'Brand guidelines',
          'Choosing components',
          'Component browser',
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

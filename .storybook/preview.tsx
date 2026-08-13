import { definePreview } from '@storybook/react-vite'
import addonDocs from '@storybook/addon-docs'
import addonA11y from '@storybook/addon-a11y'
import addonVitest from '@storybook/addon-vitest'
import addonSwatchbook from '@unpunnyfuns/swatchbook-addon'
import * as addonAnatomy from '@component-anatomy/storybook/preview'

import '../src/styles/index.css'

const preview = definePreview({
  // `definePreview` only applies the annotations listed here, so an addon
  // registered in main.ts still needs its preview entry added — that is what
  // mounts the anatomy controller over the canvas. Dropping `definePreview`
  // for a plain object would load them automatically but breaks
  // addon-vitest's setup file, so list it instead.
  addons: [addonDocs(), addonA11y(), addonVitest(), addonSwatchbook(), addonAnatomy],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { codePanel: true, toc: { headingSelector: 'h2, h3, h4' } },
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

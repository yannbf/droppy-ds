import { definePreview } from '@storybook/react-vite'
import addonDocs from '@storybook/addon-docs'
import addonA11y from '@storybook/addon-a11y'
import addonVitest from '@storybook/addon-vitest'
import addonSwatchbook from '@unpunnyfuns/swatchbook-addon'

import '../src/styles/index.css'

const preview = definePreview({
  addons: [addonDocs(), addonA11y(), addonVitest(), addonSwatchbook()],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { codePanel: true, toc: { headingSelector: 'h2, h3, h4' }},
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

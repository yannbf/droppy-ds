import { useState } from 'react'
import { definePreview, type Decorator } from '@storybook/react-vite'
import addonDocs from '@storybook/addon-docs'
import addonA11y from '@storybook/addon-a11y'
import addonVitest from '@storybook/addon-vitest'
import addonSwatchbook from '@unpunnyfuns/swatchbook-addon'
import * as addonAnatomy from '@component-anatomy/storybook/preview'

import '../src/styles/index.css'

/**
 * Gives an overlay story its own portal target inside its own canvas.
 *
 * Three things depend on it. `contain` makes the host the containing block for
 * the overlay's fixed positioning, so a popup cannot cover the page. One host
 * per story stops a docs page from stacking every open overlay on the body.
 * And releasing the body scroll lock in docs keeps the page scrollable — a
 * lock is right for one page-level overlay, but a docs page mounts every open
 * story at once and the locks compound.
 *
 * Stories that need a particular frame height set `parameters.portalHostHeight`.
 */
const PortalHost = ({
  Story,
  context,
}: {
  Story: Parameters<Decorator>[0]
  context: Parameters<Decorator>[1]
}) => {
  const [host, setHost] = useState<HTMLElement | null>(null)
  const isDocs = context.viewMode === 'docs'
  const height =
    (context.parameters.portalHostHeight as string | undefined) ?? (isDocs ? '26rem' : '100vh')

  return (
    <div
      ref={setHost}
      style={{ position: 'relative', contain: 'layout paint', overflow: 'hidden', height }}
    >
      {isDocs && <style>{`body { overflow: auto !important; }`}</style>}
      {host && <Story args={{ ...context.args, container: context.args.container ?? host }} />}
    </div>
  )
}

export const inPortalHost: Decorator = (Story, context) => (
  <PortalHost Story={Story} context={context} />
)

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

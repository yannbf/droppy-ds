import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { PageTemplateProps } from './PageTemplate'
import { PageTemplate } from './PageTemplate'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof PageTemplateProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const Header = () => <header style={{ padding: '1rem', background: '#f5f5f5' }}>Site header</header>

const Footer = () => (
  <footer style={{ padding: '1rem', background: '#1a1a1a', color: '#fff' }}>Site footer</footer>
)

const meta = {
  title: 'Layout & structure/PageTemplate',
  component: PageTemplate,
  args: {
    header: <Header />,
    footer: <Footer />,
    children: <div style={{ padding: '1rem' }}>Page content</div>,
  },
  argTypes: {
    header: { control: false, description: 'Rendered above the content, outside `<main>`.' },
    footer: { control: false, description: 'Rendered below the content, outside `<main>`.' },
    children: { control: false, description: 'The page content, inside the `<main>` landmark.' },
    className: {
      control: 'text',
      description:
        'Merged onto the root alongside the component’s own `droppy-PageTemplate` class.',
    },
  },
} satisfies Meta<typeof PageTemplate>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The shell and its `<main>` landmark. Header and footer are the caller's nodes. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('header', 'footer', 'children', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The column: header, content, footer in order.' },
        {
          id: 'content',
          name: 'Content',
          description: 'The `<main>` landmark, carrying the min-height that pins the footer down.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

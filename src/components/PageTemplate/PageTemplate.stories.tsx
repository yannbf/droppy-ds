import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageTemplate } from './PageTemplate'

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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
}

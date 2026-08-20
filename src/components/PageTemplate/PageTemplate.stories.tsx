import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { PageTemplateProps } from './PageTemplate'
import { PageTemplate } from './PageTemplate'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof PageTemplateProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/** `header` sits above the content area, outside the `<main>` landmark. */
export const HeaderProp: Story = {
  name: 'Header',
  tags: ['api-ref'],
  argTypes: hide('footer', 'className'),
  args: { footer: undefined },
}

/** `footer` sits below the content area, also outside `<main>`. */
export const FooterProp: Story = {
  name: 'Footer',
  tags: ['api-ref'],
  argTypes: hide('header', 'className'),
  args: { header: undefined },
}

/** `children` are the page content — the only part inside the landmark. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('header', 'footer', 'className'),
  args: {
    header: undefined,
    footer: undefined,
    children: <div style={{ padding: '1rem' }}>Just the content area, semantically a `main`.</div>,
  },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('header', 'footer'),
  args: {
    className: 'pagetemplate-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.pagetemplate-demo-inset { margin: 1rem; }`}</style>
      <PageTemplate {...args} />
    </>
  ),
}

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
/* tests — assertions only, one behaviour each                         */

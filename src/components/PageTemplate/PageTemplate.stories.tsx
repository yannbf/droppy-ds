import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

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

/** The page shell every routed page sits inside: header, `<main>`, footer. */
export const Default: Story = {
  tags: ['showcase'],
  args: { header: <Header />, footer: <Footer /> },
  argTypes: hide('className'),
}

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

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('header', 'footer'),
  args: { className: 'pagetemplate-demo-tinted' },
  render: (args) => (
    <>
      <style>{`.pagetemplate-demo-tinted { background: var(--ds-color-surface-sunken); }`}</style>
      <PageTemplate {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The content area carries a minimum height, so a short page's footer still
 * lands at the bottom of the viewport instead of riding up under the fold.
 */
export const ShortPageKeepsFooterDown: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { children: <div style={{ padding: '1rem' }}>One line of content.</div> },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The shell and its `<main>` landmark. Header and footer are the caller's nodes. */
export const Anatomy: Story = {
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — `App.tsx`
 * lays out its header, routes, and footer by hand, which is what this shell
 * replaces. The story to write: that layout assembled properly — Mealdrop's
 * `Header` (logo, search, cart) as `header`, a `HomePage` body of
 * `PageSection`s as children, and its four-column `FooterCard` row as
 * `footer` — with a deliberately short page so the min-height keeping the
 * footer at the fold is visible rather than merely described.
 */
export const MealdropAppShell: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersAllThreeSlots: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Site header')).toBeInTheDocument()
    await expect(canvas.getByText('Page content')).toBeInTheDocument()
    await expect(canvas.getByText('Site footer')).toBeInTheDocument()
  },
}

export const TestContentIsTheMainLandmark: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const main = canvas.getByRole('main')

    await expect(main).toHaveTextContent('Page content')
    // Header and footer sit outside the landmark, not within it.
    await expect(main).not.toHaveTextContent('Site header')
    await expect(main).not.toHaveTextContent('Site footer')
  },
}

export const TestSlotsAreOptional: Story = {
  tags: ['tests'],
  args: { header: undefined, footer: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toBeInTheDocument()
    await expect(canvas.queryByText('Site header')).not.toBeInTheDocument()
  },
}

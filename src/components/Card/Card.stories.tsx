import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { CardProps } from './Card'
import { Card } from './Card'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
  argTypes: {
    children: { control: 'text', description: 'Whatever the card groups — no slots.' },
    interactive: {
      control: 'boolean',
      description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
    },
    padded: {
      control: 'boolean',
      description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A rounded, clipped surface for grouping content. Both variant props are set
 * below, so the controls start populated — flip `padded` or `interactive`.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Card content', padded: true, interactive: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` compose freely — `Card` provides the surface and nothing else. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded', 'className'),
  args: {
    padded: true,
    children: (
      <>
        <strong>Burger Kingdom</strong>
        <p style={{ margin: '0.25rem 0 0' }}>Nicest place for burgers</p>
      </>
    ),
  },
}

/** `padded` adds uniform padding, for children that don't own their own. */
export const Padded: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'className'),
  args: { padded: true },
}

/** `interactive` is appearance only: hover dim and a pointer cursor. */
export const Interactive: Story = {
  tags: ['api-ref'],
  argTypes: hide('padded', 'className'),
  args: { interactive: true, padded: true, children: 'Hover me' },
}

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded'),
  args: { className: 'card-demo-lifted', children: 'Lifted card' },
  render: (args) => (
    <>
      <style>{`.card-demo-lifted { box-shadow: var(--ds-shadow-lift); padding: 1rem; }`}</style>
      <Card {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** An edge-to-edge image clips to the card's own corner radius instead of squaring off past it. */
export const WithImage: Story = {
  tags: ['highlight'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  render: (args) => (
    <Card {...args} style={{ width: '16rem' }}>
      <img
        src="https://placehold.co/320x180"
        alt=""
        style={{ display: 'block', width: '100%', height: '10rem', objectFit: 'cover' }}
      />
      <div style={{ padding: '1rem' }}>Restaurant name</div>
    </Card>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` providing the surface, with children in normal flow. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  args: { padded: true },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The surface: background, radius, and the clipping that keeps images in.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): four importers —
 * `Category`, `RestaurantCard`, `OrderSummary.styles`, and `FoodItem`. The
 * story to write is the restaurant tile those share: an `interactive` `Card`
 * holding an edge-to-edge photo, then a padded block of `Heading`, `Review`,
 * `Body`, and `Badge`, with the click handling wired at
 * the call site. Worth showing the category tile beside it, since the same
 * shell carries a very different composition. Mealdrop reimplemented this
 * background/radius/shadow/hover-dim shell in each of those four components
 * before it became one (docs/MEALDROP-PARITY.md).
 */
export const MealdropRestaurantTile: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRoundedAndRaised: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const card = canvas.getByText('Card content')

    await expect(getComputedStyle(card).borderRadius).toBe('8px')
    // Raised at rest: the shell carries --ds-shadow-lift itself.
    await expect(getComputedStyle(card).boxShadow).not.toBe('none')
  },
}

export const TestClipsOverflow: Story = {
  tags: ['tests'],
  render: () => (
    <Card style={{ width: '16rem' }}>
      <img src="https://placehold.co/320x180" alt="" style={{ display: 'block', width: '100%' }} />
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(getComputedStyle(card).overflow).toBe('hidden')
  },
}

export const TestInteractiveIsAppearanceOnly: Story = {
  tags: ['tests'],
  args: { interactive: true },
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(card).toHaveClass('droppy-Card--interactive')
    // No role, no tabIndex — the caller owns the interactive semantics.
    await expect(card).not.toHaveAttribute('tabindex')
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

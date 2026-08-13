import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { BadgeProps } from './Badge'
import { Badge } from './Badge'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BadgeProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/Badge',
  component: Badge,
  args: { text: 'vegan' },
  argTypes: {
    text: {
      control: 'text',
      description: 'The label. Rendered capitalized regardless of the casing passed in.',
    },
    variant: {
      control: 'radio',
      options: ['neutral', 'positive'],
      description: '`positive` matches the look of an affirmative flag, e.g. "new".',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Badge` class.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A dietary tag on a menu item. Both props are set below, so the controls
 * start populated — edit the text or flip the variant to see the two looks.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { text: 'vegan', variant: 'neutral' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `text` is the only required prop, and the only content the badge renders. */
export const Text: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant', 'className'),
  args: { text: 'gluten free' },
}

/** `variant` swaps the background, text color, and weight — not the size. */
export const Variant: Story = {
  tags: ['api-ref'],
  argTypes: hide('text', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge {...args} text="vegan" variant="neutral" />
      <Badge {...args} text="new" variant="positive" />
    </div>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant'),
  args: {
    className: 'badge-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.badge-demo-inset { margin: 1rem; }`}</style>
      <Badge {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** The pill grows with its content — there's no truncation or fixed width. */
export const LongerText: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { text: 'contains nuts and dairy' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: `Badge` renders one `<span>` and nothing inside it. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('text', 'variant', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<span>` carrying the pill background, radius, and capitalization.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): `Badge` appears in
 * `RestaurantCard.tsx`, its unstyled twin, and `RestaurantDetailPage.tsx`.
 * The story to write: a restaurant tile's category row — one neutral badge per
 * `restaurant.categories` entry ('burgers', 'comfort food') sitting under the
 * name, plus the `positive` variant standing in for the old hand-rolled
 * `NewTag` when `restaurant.isNew` is set. Mealdrop absolutely-positioned that
 * tag over the card photo; the variant carries only the colours and weight, so
 * placement stays a call-site concern.
 */
export const MealdropRestaurantTags: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestCapitalizesText: Story = {
  tags: ['tests'],
  args: { text: 'vegan' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('vegan')).textTransform).toBe('capitalize')
  },
}

export const TestVariantSwapsTokens: Story = {
  tags: ['tests'],
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge text="vegan" />
      <Badge text="new" variant="positive" />
    </div>
  ),
  play: async ({ canvas }) => {
    const neutral = canvas.getByText('vegan')
    const positive = canvas.getByText('new')

    await expect(getComputedStyle(neutral).backgroundColor).not.toBe(
      getComputedStyle(positive).backgroundColor
    )
    await expect(getComputedStyle(neutral).fontWeight).not.toBe(
      getComputedStyle(positive).fontWeight
    )
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { className: 'badge-demo-custom' },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('vegan')

    await expect(badge).toHaveClass('droppy-Badge')
    await expect(badge).toHaveClass('badge-demo-custom')
  },
}

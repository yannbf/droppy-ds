import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { iconNames } from '../Icon'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
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
  title: 'Actions/IconButton',
  component: IconButton,
  args: { name: 'arrow-right', 'aria-label': 'next', onClick: fn() },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    small: { control: 'boolean', description: 'Renders the 3rem variant instead of 4rem.' },
    onClick: { description: 'Fired on click.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-IconButton` class.',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A floating circular affordance — a carousel arrow, an overlay dismissal.
 * Both props are set below, so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'arrow-right', small: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `name` picks the glyph; the button is icon-only, so pass `aria-label` too. */
export const Name: Story = {
  tags: ['api-ref'],
  argTypes: hide('small', 'className'),
  args: { name: 'cross', 'aria-label': 'close' },
}

/** `small` swaps the 4rem control for the 3rem one, glyph included. */
export const Small: Story = {
  tags: ['api-ref'],
  argTypes: hide('name', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-left" small aria-label="previous, small" />
    </div>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('small'),
  args: {
    className: 'iconbutton-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.iconbutton-demo-inset { margin: 1rem; }`}</style>
      <IconButton {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Deliberately not theme-reactive: it stays a light pill in dark mode so it
 * reads against arbitrary imagery. Only the radius and focus ring are tokens,
 * and the glyph colour is hard-coded rather than following the icon token.
 */
export const StaysLightOnAnySurface: Story = {
  tags: ['highlight'],
  argTypes: hide('small', 'className'),
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #1a1a1a, #4cc8c0)',
        borderRadius: '0.5rem',
      }}
    >
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-right" aria-label="next" />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The circular control and the glyph it centres. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'small', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The circular `<button>`: fixed size, radius, and focus ring.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The glyph, sized from `small` and coloured independently of the theme.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): one import, in
 * `Carousel.tsx`, where a pair of them are the previous/next arrows floating
 * over the restaurant tiles. The story to write: that carousel rail — two
 * `IconButton`s positioned over a scrolling row of photo cards, which is
 * exactly the case the never-goes-dark rule exists for, since the arrows sit
 * on top of arbitrary restaurant imagery rather than on a themed surface.
 */
export const MealdropCarouselArrows: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestClickHandling: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'next' }))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const TestNamedByAriaLabel: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Icon-only: the glyph is aria-hidden, so the label is the only name.
    await expect(canvas.getByRole('button', { name: 'next' })).toHaveTextContent('')
  },
}

export const TestSmallShrinksGlyph: Story = {
  tags: ['tests'],
  render: (args) => (
    <>
      <IconButton {...args} aria-label="regular" />
      <IconButton {...args} small aria-label="small" />
    </>
  ),
  play: async ({ canvas }) => {
    const regular = canvas.getByRole('button', { name: 'regular' }).querySelector('svg')
    const small = canvas.getByRole('button', { name: 'small' }).querySelector('svg')

    await expect(regular?.getAttribute('width')).toBe('24')
    await expect(small?.getAttribute('width')).toBe('15')
  },
}

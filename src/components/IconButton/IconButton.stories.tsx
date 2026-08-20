import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
/* tests — assertions only, one behaviour each                         */

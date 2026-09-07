import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import type { ButtonProps } from './Button'
import { Button } from './Button'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Order now', onClick: fn() },
  argTypes: {
    children: { control: 'text', description: 'The label. Omit it for an icon-only button.' },
    clear: { control: 'boolean', description: 'Strips the fill, leaving just the label.' },
    large: { control: 'boolean', description: 'Taller padding, for primary calls to action.' },
    round: {
      control: 'boolean',
      description: 'Fully rounded, for icon-only affordances like a close button.',
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
      description: 'Renders an icon before the label.',
    },
    iconSize: { control: 'number', description: 'Overrides the icon’s rendered size.' },
    disabled: { control: 'boolean', description: 'Blocks the click and dims the control.' },
    onClick: { description: 'Fired on click. Never fires while `disabled`.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Button` class.',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * An icon-only button has no text to read, so its accessible name has to come
 * from `aria-label`. Drop the label without one and the control is unnamed.
 */
export const IconOnlyNeedsALabel: Story = {
  tags: ['highlight'],
  argTypes: hide('iconSize', 'className'),
  args: { icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' },
}

/** The variants side by side — the vocabulary a screen picks from. */
export const Variants: Story = {
  tags: ['highlight'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args}>Default</Button>
      <Button {...args} large>
        Large
      </Button>
      <Button {...args} clear>
        Clear
      </Button>
      <Button {...args} icon="cart">
        With icon
      </Button>
      <Button {...args} icon="cross" round clear aria-label="close">
        {undefined}
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The control and its optional leading glyph. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'clear', 'large', 'round', 'icon', 'iconSize', 'className'),
  args: { icon: 'cart', children: 'Order now' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<button>`: fill, radius, focus ring, and the disabled state.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The optional leading glyph, spaced from the label with `gap`.',
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

import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { iconNames } from './icons'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Media & content/Icon',
  component: Icon,
  args: { name: 'cart' },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    size: { control: 'text', description: 'Rendered width and height. Defaults to `1.5rem`.' },
    color: {
      control: 'text',
      description: 'Overrides the stroke colour. Defaults to the theme’s icon token.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Icon` class.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One glyph from the set. Name and size are set below, so the controls start
 * populated — pick another icon from the dropdown or change the size.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'cart', size: '1.5rem' },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<svg>`, its paths supplied by `name`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'size', 'color', 'className'),
  args: { size: '3rem' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<svg>` carrying the viewBox, the stroke colour, and the size.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

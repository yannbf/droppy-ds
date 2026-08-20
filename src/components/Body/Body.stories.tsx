import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../Badge'
import { Heading } from '../Heading'

import type { BodyProps } from './Body'
import { Body } from './Body'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BodyProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Typography/Body',
  component: Body,
  args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
  argTypes: {
    children: { control: 'text', description: 'The text, or any nodes to render inside.' },
    size: {
      control: 'radio',
      options: [undefined, 'S', 'XS', 'XXS'],
      description: 'Visual size step. Absent renders the base body size.',
    },
    fontWeight: {
      control: 'radio',
      options: ['regular', 'medium', 'bold', 'black'],
      description: 'Font weight, independent of `size` and `type`.',
    },
    type: {
      control: 'radio',
      options: ['p', 'span', 'label', 'figcaption'],
      description: 'The rendered element.',
    },
    color: {
      control: 'text',
      description: 'Overrides the text color inline. Unset, follows the primary text token.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Body` class.',
    },
  },
} satisfies Meta<typeof Body>

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

/** A single part, whose tag follows `type`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('size', 'fontWeight', 'type', 'color', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The rendered element — `<p>`, `<span>`, `<label>`, or `<figcaption>` per `type`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The text column of a restaurant tile. */
export const MealdropRestaurantCardText: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'size', 'fontWeight', 'type', 'color', 'className'),
  render: () => (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '18rem' }}>
      <Heading level={2} size={4}>
        Burger Kingdom
      </Heading>
      <Body size="S">Nicest place for burgers</Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Body size="XS" fontWeight="medium">
          Serves
        </Body>
        <Badge text="burgers" />
        <Badge text="comfort food" />
      </div>
      <Body size="XXS">Delivers in 25–35 min · €2.50 delivery · Staalstraat 12, Amsterdam</Body>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

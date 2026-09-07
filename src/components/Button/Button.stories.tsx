import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'
import { Separator } from '../Separator'

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

/** The action stack in Mealdrop's cart panel. */
export const MealdropCheckoutActions: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'clear', 'round', 'large', 'icon', 'iconSize', 'disabled', 'onClick'),
  render: () => (
    <Card padded style={{ maxWidth: '24rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading level={3} size={4}>
          Your order
        </Heading>
        <Button round clear icon="cross" aria-label="Close cart" />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', margin: '1rem 0' }}>
        <Body size="S">Cheeseburger ×2 — €17.00</Body>
        <Body size="S">Fries ×1 — €2.50</Body>
      </div>

      <Separator />

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
        <Body fontWeight="bold">Total</Body>
        <Body fontWeight="bold">€19.50</Body>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Button large icon="cart">
          Go to checkout
        </Button>
        <Button clear>Continue shopping</Button>
      </div>
    </Card>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

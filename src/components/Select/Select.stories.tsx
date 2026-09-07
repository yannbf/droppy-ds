import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Body } from '../Body'
import { Button } from '../Button'
import { Heading } from '../Heading'

import type { SelectProps } from './Select'
import { Select } from './Select'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SelectProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Forms & input/Select',
  component: Select,
  args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, onChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'Visible label, rendered above the control.' },
    options: {
      control: 'object',
      description: 'Option values. Each is rendered as both the value and the visible text.',
    },
    value: { control: 'text', description: 'The selected value.' },
    onChange: {
      description: 'Receives the selected value, coerced to a number when the option is numeric.',
    },
    disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Select` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

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

/** Label, a wrapper carrying the chevron, and the native control inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'options', 'value', 'disabled', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The field: label above, control below.' },
        { id: 'label', name: 'Label', description: 'Tied to the control by `for`/`id`.' },
        {
          id: 'wrapper',
          name: 'Wrapper',
          description: 'Positions the chevron over the control, which draws its own.',
        },
        { id: 'control', name: 'Control', description: 'The native `<select>`.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

const euros = (amount: number) =>
  amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

const BASE_PRICE = 8.5

/** Mealdrop lets a diner add at most two extras to a customisable dish. */
const EXTRAS: Record<string, number> = {
  'No extra': 0,
  'Onions +€0.50': 0.5,
  'Jalapeños +€0.75': 0.75,
  'Extra cheese +€1.00': 1,
  'Mature cheddar +€1.25': 1.25,
  'Bacon +€1.50': 1.5,
  'Beef patty +€3.00': 3,
}

const EXTRA_OPTIONS = Object.keys(EXTRAS)

function BurgerCustomiser() {
  const [first, setFirst] = useState('Bacon +€1.50')
  const [second, setSecond] = useState('Extra cheese +€1.00')

  const total = BASE_PRICE + (EXTRAS[first] ?? 0) + (EXTRAS[second] ?? 0)

  return (
    <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '22rem' }}>
      <div style={{ display: 'grid', gap: '0.25rem' }}>
        <Heading level={3} size={4}>
          Cheeseburger
        </Heading>
        <Body size="S">Nice grilled burger with cheese · {euros(BASE_PRICE)}</Body>
      </div>

      <Select
        label="first extra"
        options={EXTRA_OPTIONS}
        value={first}
        onChange={(next) => setFirst(next as string)}
      />

      <Select
        label="second extra"
        options={EXTRA_OPTIONS}
        value={second}
        onChange={(next) => setSecond(next as string)}
      />

      <Button large icon="cart">
        Add to cart · {euros(total)}
      </Button>
    </div>
  )
}

/** Choosing up to two extras for a customisable burger. */
export const MealdropBurgerExtras: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'options', 'value', 'onChange', 'disabled', 'className'),
  render: () => <BurgerCustomiser />,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

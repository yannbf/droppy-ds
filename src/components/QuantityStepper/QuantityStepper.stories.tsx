import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Body } from '../Body'
import { Heading } from '../Heading'
import { Separator } from '../Separator'

import type { QuantityStepperProps } from './QuantityStepper'
import { QuantityStepper } from './QuantityStepper'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof QuantityStepperProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const StepperDemo = ({
  value: initialValue,
  onChange,
  ...args
}: React.ComponentProps<typeof QuantityStepper>) => {
  const [value, setValue] = useState(initialValue)

  return (
    <QuantityStepper
      {...args}
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

const meta = {
  title: 'Forms & input/QuantityStepper',
  component: QuantityStepper,
  args: { value: 1, onChange: fn() },
  argTypes: {
    value: { control: 'number', description: 'Current quantity.' },
    onChange: { description: 'Receives the new quantity on each click.' },
    min: { control: 'number', description: 'Lower bound. Minus disables here. Defaults to 1.' },
    max: { control: 'number', description: 'Upper bound. Plus disables here. Defaults to 10.' },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the control group. Defaults to “quantity”.',
    },
    className: {
      control: 'text',
      description:
        'Merged onto the root alongside the component’s own `droppy-QuantityStepper` class.',
    },
  },
  render: (args) => <StepperDemo {...args} />,
} satisfies Meta<typeof QuantityStepper>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A cart line's quantity. Bounds are set below, so the controls start
 * populated — click up to `max` and the plus disables rather than wrapping.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { value: 1, min: 1, max: 10, 'aria-label': 'quantity' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `value` is the current quantity — the component is fully controlled. */
export const Value: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { value: 4 },
}

/** `min` is the lower bound; the minus button disables on it. */
export const Min: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { value: 2, min: 2 },
}

/** `max` is the upper bound; the plus button disables on it. */
export const Max: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { value: 3, max: 3 },
}

/** `aria-label` names the group, since the two buttons alone don't say what of. */
export const AriaLabel: Story = {
  name: 'aria-label',
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { 'aria-label': 'Cheeseburger quantity' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { className: 'quantitystepper-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.quantitystepper-demo-inset { margin: 1rem; }`}</style>
      <StepperDemo {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The buttons disable at the bounds rather than wrapping or clamping silently,
 * so a click never looks like it did nothing. The value carries `aria-live`,
 * because a disabled button and a changed number are the only signals the
 * group gives.
 */
export const BoundsDisableRatherThanClamp: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { value: 1, min: 1, max: 2 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The group, its two round buttons, and the live value between them. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('value', 'min', 'max', 'aria-label', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `role="group"` wrapper carrying the accessible name.',
        },
        { id: 'decrement', name: 'Decrement', description: 'The minus button; disabled at `min`.' },
        {
          id: 'value',
          name: 'Value',
          description: 'The current quantity, `aria-live="polite"` so changes are announced.',
        },
        { id: 'increment', name: 'Increment', description: 'The plus button; disabled at `max`.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

const cartEuros = (amount: number) =>
  amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

const initialLines = [
  { id: 'cheeseburger', name: 'Cheeseburger', price: 8.5, quantity: 2 },
  { id: 'fries', name: 'Fries', price: 2.5, quantity: 1 },
  { id: 'coca-cola', name: 'Coca-Cola', price: 1.75, quantity: 3 },
]

function CartLines() {
  const [lines, setLines] = useState(initialLines)

  const setQuantity = (id: string, quantity: number) =>
    setLines((rows) => rows.map((row) => (row.id === id ? { ...row, quantity } : row)))

  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '26rem' }}>
      <Heading level={3} size={4}>
        Your order
      </Heading>

      {lines.map((line) => (
        <div
          key={line.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <Body size="S">{line.name}</Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <QuantityStepper
              value={line.quantity}
              onChange={(next) => setQuantity(line.id, next)}
              aria-label={`${line.name} quantity`}
            />
            <Body size="S" fontWeight="bold" style={{ minWidth: '4rem', textAlign: 'right' }}>
              {cartEuros(line.price * line.quantity)}
            </Body>
          </div>
        </div>
      ))}

      <Separator />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Body fontWeight="bold">Total</Body>
        <Body fontWeight="bold">{cartEuros(total)}</Body>
      </div>
    </div>
  )
}

/** Cart lines with per-dish quantity steppers. */
export const MealdropCartLine: Story = {
  tags: ['examples'],
  argTypes: hide('value', 'onChange', 'min', 'max', 'aria-label', 'className'),
  render: () => <CartLines />,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestDisablesAtMin: Story = {
  tags: ['tests'],
  args: { value: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'decrease quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'increase quantity by one' })
    ).not.toBeDisabled()
  },
}

export const TestDisablesAtMax: Story = {
  tags: ['tests'],
  args: { value: 10 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'increase quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'decrease quantity by one' })
    ).not.toBeDisabled()
  },
}

export const TestReportsEachChange: Story = {
  tags: ['tests'],
  args: { value: 1, max: 2 },
  play: async ({ args, canvas }) => {
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })

    await userEvent.click(increase)
    await expect(args.onChange).toHaveBeenCalledWith(2)
    await expect(increase).toBeDisabled()

    await userEvent.click(decrease)
    await expect(args.onChange).toHaveBeenCalledWith(1)
    await expect(decrease).toBeDisabled()
  },
}

export const TestGroupIsNamed: Story = {
  tags: ['tests'],
  args: { 'aria-label': 'Cheeseburger quantity' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Cheeseburger quantity' })).toBeInTheDocument()
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { value: 1, onChange: fn() },
}

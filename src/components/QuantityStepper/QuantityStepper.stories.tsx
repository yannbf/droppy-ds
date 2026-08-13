import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

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

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
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
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): the minus/plus pair was an
 * inline pattern in the food-item modal and the cart before it became a
 * component (docs/MEALDROP-PARITY.md). The story to write: a cart line —
 * 'Cheeseburger €8.50' with a stepper beside it and a running line total that
 * follows the quantity — with the `aria-label` naming the dish rather than
 * saying 'quantity', since a cart has several of these and the default name
 * would repeat for each.
 */
export const MealdropCartLine: Story = {
  tags: ['examples'],
  render: () => TODO,
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

import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

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
/* tests — assertions only, one behaviour each                         */

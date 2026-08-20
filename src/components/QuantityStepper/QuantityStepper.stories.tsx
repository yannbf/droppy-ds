import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { QuantityStepper } from './QuantityStepper'

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

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: { value: 1, onChange: fn() },
}

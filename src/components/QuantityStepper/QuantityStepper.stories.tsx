import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { QuantityStepper } from './QuantityStepper'

const QuantityStepperDemo = ({
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
  title: 'Components/QuantityStepper',
  component: QuantityStepper,
  args: {
    value: 1,
    onChange: fn(),
  },
  render: (args) => <QuantityStepperDemo {...args} />,
} satisfies Meta<typeof QuantityStepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AtMin: Story = {
  args: { value: 1 },
  play: async ({ canvas }) => {
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })

    await expect(decrease).toBeDisabled()
    await expect(increase).not.toBeDisabled()
  },
}

export const AtMax: Story = {
  args: { value: 10 },
  play: async ({ canvas }) => {
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })

    await expect(increase).toBeDisabled()
    await expect(decrease).not.toBeDisabled()
  },
}

/** Clicking plus/minus reports each new value and disables at the bounds. */
export const Increments: Story = {
  args: { value: 1, max: 2 },
  play: async ({ args, canvas }) => {
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })

    await expect(decrease).toBeDisabled()

    await userEvent.click(increase)
    await expect(args.onChange).toHaveBeenCalledWith(2)
    await expect(increase).toBeDisabled()
    await expect(decrease).not.toBeDisabled()

    await userEvent.click(decrease)
    await expect(args.onChange).toHaveBeenCalledWith(1)
    await expect(decrease).toBeDisabled()
    await expect(increase).not.toBeDisabled()
  },
}

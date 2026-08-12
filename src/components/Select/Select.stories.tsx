import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Select } from './Select'

const meta = {
  title: 'Forms & input/Select',
  component: Select,
  args: {
    label: 'servings',
    options: [1, 2, 3, 4, 5],
    value: 2,
    onChange: fn(),
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

export const Default: Story = {
  tags: ['showcase'],
}

export const TextOptions: Story = {
  tags: ['api-ref'],
  args: {
    label: 'delivery window',
    options: ['ASAP', 'In 30 minutes', 'In an hour', 'Tonight'],
    value: 'ASAP',
  },
}

export const Disabled: Story = {
  tags: ['api-ref'],
  args: { disabled: true },
}

/** Numeric options come back as numbers, so a caller can use the value without
 *  parsing it first. */
export const ReportsNumericValues: Story = {
  tags: ['tests'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.selectOptions(canvas.getByLabelText('servings'), '4')

    await expect(args.onChange).toHaveBeenCalledWith(4)
  },
}

export const ReportsTextValues: Story = {
  tags: ['tests'],
  args: TextOptions.args,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.selectOptions(canvas.getByLabelText('delivery window'), 'Tonight')

    await expect(args.onChange).toHaveBeenCalledWith('Tonight')
  },
}

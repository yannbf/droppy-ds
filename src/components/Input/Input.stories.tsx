import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Input } from './Input'

const meta = {
  title: 'Forms & input/Input',
  component: Input,
  args: { label: 'Full name' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
}

export const WithError: Story = {
  tags: ['api-ref'],
  args: { error: 'Enter your full name' },
}

/** The error slot keeps its height whether or not a message is showing, so
 *  validating a field never shifts the ones below it. */
export const ErrorDoesNotShiftLayout: Story = {
  tags: ['highlight'],
  render: (args) => (
    <>
      <Input {...args} label="Street" error="Enter a street" />
      <Input {...args} label="City" />
    </>
  ),
}

export const Types: Story = {
  tags: ['api-ref'],
  render: (args) => (
    <>
      <Input {...args} label="Email" type="email" />
      <Input {...args} label="Phone" type="tel" />
      <Input {...args} label="Postcode" />
    </>
  ),
}

export const LabelNamesTheControl: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByLabelText('Full name')

    await userEvent.type(field, 'Ada Lovelace')

    await expect(field).toHaveValue('Ada Lovelace')
  },
}

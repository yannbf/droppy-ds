import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from './Body'

const meta = {
  title: 'Typography/Body',
  component: Body,
  args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
} satisfies Meta<typeof Body>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <>
      <Body {...args}>Base</Body>
      <Body {...args} size="S">
        S
      </Body>
      <Body {...args} size="XS">
        XS
      </Body>
      <Body {...args} size="XXS">
        XXS
      </Body>
    </>
  ),
}

export const Weights: Story = {
  render: (args) => (
    <>
      <Body {...args} fontWeight="regular">
        Regular
      </Body>
      <Body {...args} fontWeight="medium">
        Medium
      </Body>
      <Body {...args} fontWeight="bold">
        Bold
      </Body>
      <Body {...args} fontWeight="black">
        Black
      </Body>
    </>
  ),
}

/** `type` picks the rendered element — `label` renders a real `<label>`, so it
 *  can be associated with a control instead of styled with a `span`. */
export const RendersMatchingTag: Story = {
  args: { type: 'label', children: 'Delivery address' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Delivery address').tagName).toBe('LABEL')
  },
}

export const ElementChoice: Story = {
  render: (args) => (
    <>
      <Body {...args} type="p">
        p
      </Body>
      <Body {...args} type="span">
        span
      </Body>
      <Body {...args} type="label">
        label
      </Body>
      <Body {...args} type="figcaption">
        figcaption
      </Body>
    </>
  ),
}

export const ColorOverride: Story = {
  args: { color: 'var(--ds-color-text-error)', children: 'Delivery unavailable at this address.' },
}

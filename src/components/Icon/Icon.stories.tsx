import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icon } from './Icon'
import { iconNames } from './icons'

const meta = {
  title: 'Media & content/Icon',
  component: Icon,
  args: { name: 'cart' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'text' },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
}

export const Sizes: Story = {
  tags: ['api-ref'],
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {['1rem', '1.5rem', '2rem', '3rem'].map((size) => (
        <Icon {...args} key={size} size={size} />
      ))}
    </div>
  ),
}

/** Every icon in the set. Icons are decorative by default (`aria-hidden`) — the
 *  control they sit in carries the accessible name. */
export const Gallery: Story = {
  tags: ['api-ref'],
  render: (args) => (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ textAlign: 'center', fontSize: '0.75rem', width: '5rem' }}>
          <Icon {...args} name={name} size="2rem" style={{ margin: '0 auto 0.5rem' }} />
          {name}
        </div>
      ))}
    </div>
  ),
}

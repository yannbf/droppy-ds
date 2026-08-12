import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from './Button'

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: {
    children: 'Order now',
    onClick: fn(),
  },
  argTypes: {
    icon: {
      control: 'select',
      options: [undefined, 'cart', 'cross', 'plus', 'minus', 'arrow-right'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
}

export const Large: Story = {
  tags: ['api-ref'],
  args: { large: true },
}

/** Secondary actions, so the page has one obvious primary. */
export const Clear: Story = {
  tags: ['api-ref'],
  args: { clear: true },
}

export const WithIcon: Story = {
  tags: ['api-ref'],
  args: { icon: 'cart' },
}

/** Icon-only buttons carry their name in `aria-label` — there is no text to read. */
export const IconOnly: Story = {
  tags: ['highlight'],
  args: { icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' },
}

export const Disabled: Story = {
  tags: ['api-ref'],
  args: { disabled: true },
}

export const Variants: Story = {
  tags: ['api-ref'],
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args}>Default</Button>
      <Button {...args} large>
        Large
      </Button>
      <Button {...args} clear>
        Clear
      </Button>
      <Button {...args} icon="cart">
        With icon
      </Button>
      <Button {...args} icon="cross" round clear aria-label="close">
        {undefined}
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
    </div>
  ),
}

export const ClickHandling: Story = {
  tags: ['tests'],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const DisabledSwallowsClicks: Story = {
  tags: ['tests'],
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }), {
      pointerEventsCheck: 0,
    })

    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

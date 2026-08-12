import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import { Sidebar } from './Sidebar'

const SidebarDemo = ({
  isOpen: initialOpen,
  onClose,
  ...args
}: React.ComponentProps<typeof Sidebar>) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div style={{ padding: '1rem' }}>
      <Button icon="cart" onClick={() => setIsOpen(true)}>
        Open cart
      </Button>
      <Sidebar
        {...args}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          onClose()
        }}
      />
    </div>
  )
}

const meta = {
  title: 'Overlays/Sidebar',
  component: Sidebar,
  args: {
    isOpen: false,
    title: 'Your order',
    onClose: fn(),
    children: (
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        <li>Margherita — €9.50</li>
        <li>Garlic bread — €4.00</li>
        <li>Sparkling water — €2.50</li>
      </ul>
    ),
  },
  render: (args) => <SidebarDemo {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  args: { isOpen: true },
}

/** The footer is pinned and the content scrolls above it. It is a plain flex
 *  container — the caller owns the arrangement inside it. */
export const WithFooter: Story = {
  args: {
    isOpen: true,
    footer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <strong>Total — €16.00</strong>
        <Button large icon="arrow-right">
          Go to checkout
        </Button>
      </div>
    ),
  },
}

export const FullWidthOnMobile: Story = {
  args: { isOpen: true },
  globals: { viewport: { value: 'mobile1' } },
}

/** The title names the dialog, so a screen reader announces what opened. */
export const TitleNamesTheDialog: Story = {
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(body.getByRole('dialog', { name: 'Your order' })).toBeVisible())
  },
}

export const OpensAndCloses: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open cart' }))
    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())

    await userEvent.click(body.getByRole('button', { name: 'close sidebar' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
    // Settle the exit transition before the automatic a11y check: Base UI's
    // focus guards (aria-hidden + tabindex) exist while the drawer is mounted
    // and trip axe's aria-hidden-focus rule if it snapshots mid-close.
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

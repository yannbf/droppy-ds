import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'
import { Heading } from '../Heading'

import { Modal } from './Modal'

const ModalDemo = ({
  isOpen: initialOpen,
  onClose,
  ...args
}: React.ComponentProps<typeof Modal>) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          onClose()
        }}
      />
    </>
  )
}

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: false,
    onClose: fn(),
    children: (
      <div style={{ padding: '1.5rem' }}>
        <Heading level={4}>Remove from cart?</Heading>
        <p>This takes the item out of your order. You can add it back at any time.</p>
      </div>
    ),
  },
  render: (args) => <ModalDemo {...args} />,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  args: { isOpen: true },
}

/** Below 768px the card becomes a bottom sheet and slides up from the edge. */
export const Mobile: Story = {
  args: { isOpen: true },
  globals: { viewport: { value: 'mobile1' } },
}

export const OpensAndCloses: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())

    await userEvent.click(body.getByRole('button', { name: 'close modal' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}

/** Escape dismisses the dialog — Base UI wires it, and every modal in the
 *  system inherits it. */
export const EscapeDismisses: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}

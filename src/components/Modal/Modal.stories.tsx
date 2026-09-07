import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from '../Button'
import { Heading } from '../Heading'

import { inPortalHost } from '../../../.storybook/preview'

import { Modal } from './Modal'

const ModalDemo = ({
  isOpen: initialOpen,
  onClose,
  ...args
}: React.ComponentProps<typeof Modal>) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div style={{ padding: '1rem' }}>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
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

const body = (
  <div style={{ padding: '1.5rem' }}>
    <Heading level={4}>Remove from cart?</Heading>
    <p>This takes the item out of your order. You can add it back at any time.</p>
  </div>
)

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  args: { isOpen: false, onClose: fn(), children: body },
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the dialog is open. Fully controlled.' },
    onClose: { description: 'Fired on close — the button, Escape, or an outside press.' },
    children: { control: false, description: 'The dialog body. The top bar is supplied.' },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the dialog. Defaults to “dialog”.',
    },
    container: {
      control: false,
      description: 'Where to portal. An element or a selector; defaults to the body.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the popup alongside the component’s own `droppy-Modal` class.',
    },
  },
  render: (args) => <ModalDemo {...args} />,
  decorators: [inPortalHost],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: { isOpen: false, onClose: fn() },
}

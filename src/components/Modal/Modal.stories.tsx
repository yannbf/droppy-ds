import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Button } from '../Button'
import { Heading } from '../Heading'

import { inPortalHost } from '../../../.storybook/preview'

import type { ModalProps } from './Modal'
import { Modal } from './Modal'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ModalProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/** `isOpen` drives everything — the component holds no open state of its own. */
export const IsOpen: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { isOpen: false },
}

/** `children` are the body; the top bar and its close button are supplied. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: {
    isOpen: true,
    children: (
      <div style={{ padding: '1.5rem' }}>
        <Heading level={4}>Your order is on its way</Heading>
        <p>Arriving in about 25 minutes.</p>
      </div>
    ),
  },
}

/** `aria-label` names the dialog, since the body has no guaranteed heading. */
export const AriaLabel: Story = {
  name: 'aria-label',
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true, 'aria-label': 'Remove from cart' },
}

/**
 * `container` picks the portal target — an element or a selector. Mealdrop
 * portals into its own `#modal` node; unset, it goes to the body.
 */
export const Container: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { isOpen: true, container: '#modal-container-demo' },
  render: (args) => (
    <>
      <div id="modal-container-demo" />
      <ModalDemo {...args} />
    </>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('container'),
  args: { isOpen: true, className: 'modal-demo-inset', container: '#modal-classname-demo' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.modal-demo-inset { margin: 1rem; }`}</style>
      <div id="modal-classname-demo" />
      <ModalDemo {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** Below 768px the card becomes a bottom sheet and slides up from the edge. */
export const Mobile: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true },
  globals: { viewport: { value: 'mobile1' } },
}

/**
 * Focus lands on the popup itself, not the close button: the content is what
 * the reader asked for, and landing on "close" reads as an invitation to
 * leave. Tab still reaches the close button first.
 */
export const InitialFocusIsThePopup: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Portalled into a node inside the canvas via `container`, so the Anatomy
 * panel can reach the parts — it only scans the story canvas, and the default
 * portal target is the document body.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('isOpen', 'children', 'container', 'className'),
  args: { isOpen: true, 'aria-label': 'Remove from cart' },
  render: (args) => (
    // Rendered open and with no trigger, so the panel scans the dialog's own
    // parts rather than the button that would have opened it.
    <Modal {...args} onClose={() => {}}>
      {body}
    </Modal>
  ),
  parameters: {
    anatomy: {
      parts: [
        { id: 'backdrop', name: 'Backdrop', description: 'The dimmed layer behind the dialog.' },
        {
          id: 'root',
          name: 'Popup',
          description: 'The dialog card: `aria-modal`, the focus trap, and the shape.',
        },
        { id: 'topbar', name: 'Top bar', description: 'Holds the close affordance.' },
        { id: 'close', name: 'Close', description: 'The round icon button that dismisses.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

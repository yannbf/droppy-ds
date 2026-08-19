import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'
import { Heading } from '../Heading'

import { Body } from '../Body'
import { QuantityStepper } from '../QuantityStepper'

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

/**
 * A blocking confirmation. `isOpen` and the accessible name are set below, so
 * the controls start populated — flip `isOpen` to open it without clicking.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { isOpen: true, 'aria-label': 'Remove from cart' },
  argTypes: hide('container', 'className'),
}

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

/**
 * Both the backdrop and the popup transition off `[data-starting-style]` and
 * `[data-ending-style]`, which Base UI sets while the dialog enters and
 * leaves. The popup stays mounted through the exit, so the close animation
 * runs before it disappears.
 */
export const OpenCloseTransition: Story = {
  tags: ['animation'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)
    const popup = await doc.findByRole('dialog')
    const backdrop = canvasElement.ownerDocument.querySelector(
      '[data-testid="modal-backdrop"]'
    ) as HTMLElement

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
    await expect(getComputedStyle(backdrop).transitionProperty).toContain('opacity')
  },
}

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

/** Mealdrop formats with the runtime locale rather than a fixed one. */
const toCurrency = (amount: number) =>
  amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

const dish = { name: 'Cheeseburger', description: 'Nice grilled burger with cheese', price: 8.5 }

function FoodItemModal({ container }: Pick<ModalProps, 'container'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)

  return (
    <div>
      {/* Mealdrop lays the modal out with styled-components and a `breakpoints.M`
          media query; the same rules are inlined here so the story is a port
          rather than an approximation. */}
      <style>{`
        .mealdrop-modal-top {
          padding: 2.5rem 1.5rem;
          background: var(--ds-color-surface-sunken);
          border-radius: 16px 16px 0px 0px;
        }
        .mealdrop-modal-body { margin: 0; margin-top: 8px; }
        .mealdrop-modal-bottom {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .mealdrop-modal-steppers {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex: 0.45;
          margin-bottom: 1.5rem;
          margin-right: 0;
        }
        .mealdrop-modal-confirm { flex: 1; }
        @media (min-width: 768px) {
          .mealdrop-modal-bottom { flex-direction: row; }
          .mealdrop-modal-steppers {
            margin-bottom: 0;
            margin-right: 1.5rem;
            justify-content: space-between;
          }
        }
      `}</style>

      <div style={{ padding: '1rem' }}>
        <Button onClick={() => setIsOpen(true)}>{dish.name}</Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        container={container}
        aria-label={dish.name}
      >
        <div>
          <div className="mealdrop-modal-top">
            <Heading>{dish.name}</Heading>
            <Body className="mealdrop-modal-body">{dish.description}</Body>
          </div>
          <div className="mealdrop-modal-bottom">
            <div className="mealdrop-modal-steppers">
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={10} />
            </div>
            <Button
              className="mealdrop-modal-confirm"
              aria-label="confirm"
              onClick={() => setIsOpen(false)}
            >
              add for {toCurrency(dish.price * quantity)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/** Mealdrop's food-item modal, opened from a dish on the menu. */
export const MealdropFoodItemModal: Story = {
  tags: ['examples'],
  argTypes: hide('isOpen', 'onClose', 'container', 'aria-label', 'children', 'className'),
  render: (args) => <FoodItemModal container={args.container} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: dish.name }))

    await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible())
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestOpensAndCloses: Story = {
  tags: ['tests'],
  play: async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.click(doc.getByRole('button', { name: 'close modal' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}

export const TestEscapeDismisses: Story = {
  tags: ['tests'],
  play: async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  },
}

export const TestDialogIsNamed: Story = {
  tags: ['tests'],
  args: { isOpen: true, 'aria-label': 'Remove from cart' },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog', { name: 'Remove from cart' })).toBeVisible())
  },
}

export const TestContainerPortalsWhereAsked: Story = {
  tags: ['tests'],
  args: { isOpen: true, container: '#modal-portal-test' },
  render: (args) => (
    <>
      <div id="modal-portal-test" data-testid="portal-host" />
      <ModalDemo {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const host = canvas.getByTestId('portal-host')

    await waitFor(() => expect(host.querySelector('[role="dialog"]')).not.toBeNull())
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { isOpen: false, onClose: fn() },
}

import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Button } from '../Button'

import { Body } from '../Body'
import { Select } from '../Select'

import { inPortalHost } from '../../../.storybook/preview'

import type { SidebarProps } from './Sidebar'
import { Sidebar } from './Sidebar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SidebarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

const order = (
  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
    <li>Margherita — €9.50</li>
    <li>Garlic bread — €4.00</li>
    <li>Sparkling water — €2.50</li>
  </ul>
)

const meta = {
  title: 'Overlays/Sidebar',
  component: Sidebar,
  args: { isOpen: false, title: 'Your order', onClose: fn(), children: order },
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the panel is open. Fully controlled.' },
    title: { control: 'text', description: 'Heading in the top bar. Also names the dialog.' },
    onClose: { description: 'Fired on close — the button, Escape, a swipe, or an outside press.' },
    children: { control: false, description: 'The scrolling panel content.' },
    footer: { control: false, description: 'Pinned to the bottom — totals and primary actions.' },
    container: {
      control: false,
      description: 'Where to portal. An element or a selector; defaults to the body.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the popup alongside the component’s own `droppy-Sidebar` class.',
    },
  },
  render: (args) => <SidebarDemo {...args} />,
  parameters: { layout: 'fullscreen' },
  decorators: [inPortalHost],
} satisfies Meta<typeof Sidebar>

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

/**
 * Portalled into a node inside the canvas via `container`, so the Anatomy
 * panel can reach the parts — it only scans the story canvas, and the default
 * portal target is the document body.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('isOpen', 'title', 'children', 'footer', 'container', 'className'),
  args: {
    isOpen: true,
    className: 'sidebar-anatomy-footer',
    footer: (
      <Body type="span" fontWeight="bold">
        Total — €16.00
      </Body>
    ),
  },
  render: (args) => (
    // Rendered open and with no trigger, so the panel scans the drawer's own
    // parts rather than the button that would have opened it. The footer's
    // reserved height is overridden ([#140]) so a one-line total sits in a bar
    // rather than at the top of a 165px block.
    <>
      <style>{`
        .sidebar-anatomy-footer .droppy-Sidebar-footer {
          --droppy-sidebar-footer-height: 3.5rem;
          align-items: center;
        }
      `}</style>
      <Sidebar {...args} onClose={() => {}}>
        {order}
      </Sidebar>
    </>
  ),
  parameters: {
    portalHostHeight: '28rem',
    anatomy: {
      parts: [
        { id: 'backdrop', name: 'Backdrop', description: 'The dimmed layer behind the panel.' },
        { id: 'root', name: 'Popup', description: 'The sliding panel: focus trap, swipe, shape.' },
        { id: 'topbar', name: 'Top bar', description: 'Holds the title and the close button.' },
        { id: 'title', name: 'Title', description: 'The heading; also names the dialog.' },
        { id: 'close', name: 'Close', description: 'The round icon button that dismisses.' },
        { id: 'content', name: 'Content', description: 'The scrolling region between the two.' },
        { id: 'footer', name: 'Footer', description: 'Pinned to the bottom; absent without one.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

const cartEuros = (amount: number) =>
  amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

const initialCart = [
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    description: 'Nice grilled burger with cheese',
    price: 8.5,
    quantity: 2,
  },
  { id: 'fries', name: 'Fries', description: 'Fried french fries', price: 2.5, quantity: 1 },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    description: 'Chilled can, 330ml',
    price: 1.75,
    quantity: 3,
  },
]

const QUANTITY_OPTIONS = Array.from({ length: 11 }, (_, index) => index)

function ShoppingCartMenu({ container }: Pick<SidebarProps, 'container'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState(initialCart)

  const setQuantity = (id: string, quantity: number) =>
    setCartItems((rows) => rows.map((row) => (row.id === id ? { ...row, quantity } : row)))

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <Button icon="cart" onClick={() => setIsOpen(true)}>
          {cartItems.reduce((count, item) => count + item.quantity, 0)}
        </Button>
      </div>

      <Sidebar
        title="Your order"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        container={container}
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}
            >
              <Body type="span">Total</Body>
              <Body type="span">{cartEuros(totalPrice)}</Body>
            </div>
            <Button disabled={totalPrice === 0} large onClick={() => setIsOpen(false)}>
              Checkout
            </Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: '0.75' }}>
                <Body type="span" fontWeight="medium">
                  {item.name}
                </Body>
                <Body>{item.description}</Body>
                <Body>{cartEuros(item.price * item.quantity)}</Body>
              </div>
              <div style={{ flex: '0.25' }}>
                <Select
                  value={item.quantity}
                  onChange={(next) => setQuantity(item.id, next as number)}
                  aria-label={`${item.name}, ${item.quantity} times`}
                  options={QUANTITY_OPTIONS}
                />
              </div>
            </div>
          ))}
        </div>
      </Sidebar>
    </div>
  )
}

/** Mealdrop's cart panel, opened from the header's cart button. */
export const MealdropCartPanel: Story = {
  tags: ['examples'],
  argTypes: hide('isOpen', 'title', 'onClose', 'footer', 'container', 'children', 'className'),
  render: (args) => <ShoppingCartMenu container={args.container} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: '6' }))

    await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible())
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

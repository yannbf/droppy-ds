import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import type { SidebarProps } from './Sidebar'
import { Sidebar } from './Sidebar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SidebarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

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
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A cart reviewed alongside the page. `isOpen` and `title` are set below, so
 * the controls start populated — flip `isOpen` to open it without clicking.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { isOpen: true, title: 'Your order' },
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

/** `title` is the top-bar heading, and the dialog's accessible name. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true, title: 'Filter restaurants' },
}

/** `children` scroll; the top bar and footer stay put around them. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true, children: order },
}

/** `footer` is pinned to the bottom — a plain flex container the caller fills. */
export const Footer: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
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

/** `container` picks the portal target — an element or a selector. */
export const Container: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { isOpen: true, container: '#sidebar-container-demo' },
  render: (args) => (
    <>
      <div id="sidebar-container-demo" />
      <SidebarDemo {...args} />
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
  args: { isOpen: true, className: 'sidebar-demo-inset', container: '#sidebar-classname-demo' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.sidebar-demo-inset { margin: 1rem; }`}</style>
      <div id="sidebar-classname-demo" />
      <SidebarDemo {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** Below the mobile breakpoint the panel takes the full width. */
export const FullWidthOnMobile: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true },
  globals: { viewport: { value: 'mobile1' } },
}

/**
 * The footer is pinned and the content scrolls above it, so a long order never
 * pushes the checkout button out of reach.
 */
export const PinnedFooterWithScrollingContent: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: {
    isOpen: true,
    children: (
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        {Array.from({ length: 20 }, (_, index) => (
          <li key={index}>Margherita — €9.50</li>
        ))}
      </ul>
    ),
    footer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <strong>Total — €190.00</strong>
        <Button large icon="arrow-right">
          Go to checkout
        </Button>
      </div>
    ),
  },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The panel slides from the trailing edge off `[data-starting-style]` and
 * `[data-ending-style]`, and stays mounted through the exit so the close
 * animation runs before it leaves the DOM. Base UI also drives swipe-to-dismiss
 * from the same states.
 */
export const SlideTransition: Story = {
  tags: ['animation'],
  argTypes: hide('container', 'className'),
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)
    const popup = await doc.findByRole('dialog')

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
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
  argTypes: hide('isOpen', 'title', 'children', 'footer', 'container', 'className'),
  args: {
    isOpen: true,
    container: '#sidebar-anatomy-host',
    footer: <strong>Total — €16.00</strong>,
  },
  render: (args) => (
    <>
      <div id="sidebar-anatomy-host" />
      <SidebarDemo {...args} />
    </>
  ),
  parameters: {
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): one import, driving the
 * cart panel from `ShoppingCartMenu`. The story to write: that cart — the real
 * line items with `QuantityStepper` per row, a `ScrollArea` for a long order,
 * and the pinned footer carrying the total and 'Go to checkout' — which is the
 * composition the footer slot exists for. Like `Modal`, it should pass
 * `container` explicitly rather than relying on Mealdrop's old `#modal` node.
 */
export const MealdropCartPanel: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestOpensAndCloses: Story = {
  tags: ['tests'],
  play: async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open cart' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.click(doc.getByRole('button', { name: 'close sidebar' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
    // Settle the exit transition before the automatic a11y check: Base UI's
    // focus guards (aria-hidden + tabindex) exist while the drawer is mounted
    // and trip axe's aria-hidden-focus rule if it snapshots mid-close.
    await waitFor(() => expect(doc.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const TestTitleNamesTheDialog: Story = {
  tags: ['tests'],
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog', { name: 'Your order' })).toBeVisible())
  },
}

export const TestFooterIsOptional: Story = {
  tags: ['tests'],
  args: { isOpen: true, footer: undefined },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())
    await expect(
      canvasElement.ownerDocument.querySelector('[data-testid="sidebar-footer"]')
    ).toBeNull()
  },
}

export const TestContainerPortalsWhereAsked: Story = {
  tags: ['tests'],
  args: { isOpen: true, container: '#sidebar-portal-test' },
  render: (args) => (
    <>
      <div id="sidebar-portal-test" data-testid="portal-host" />
      <SidebarDemo {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    const host = canvas.getByTestId('portal-host')

    await waitFor(() => expect(host.querySelector('[role="dialog"]')).not.toBeNull())
  },
}

import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import type { ToastProviderProps } from './Toast'
import { ToastProvider, useToast } from './Toast'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ToastProviderProps>) =>
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

const CreateToastButton = ({ label = 'Save draft' }: { label?: string }) => {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast.add({ title: 'Draft saved', description: 'Your changes are stored automatically.' })
      }
    >
      {label}
    </Button>
  )
}

const meta = {
  title: 'Feedback & status/Toast',
  component: ToastProvider,
  args: { children: <CreateToastButton /> },
  argTypes: {
    children: { control: false, description: 'The tree that raises toasts via `useToast`.' },
    timeout: {
      control: 'number',
      description: 'Milliseconds before a toast auto-dismisses. `0` disables auto-dismiss.',
    },
    limit: {
      control: 'number',
      description: 'How many show at once; older ones are marked limited rather than removed.',
    },
    container: {
      control: false,
      description: 'Where to portal the stack. An element or a selector; defaults to the body.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the viewport alongside the component’s own `droppy-Toast` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Wrap the tree once, then raise toasts from anywhere beneath with
 * `useToast().add(...)`. There is no trigger and no `open` prop — click the
 * button to see one.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { timeout: 5000, limit: 3 },
  argTypes: hide('container', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the tree that raises toasts — the provider renders it as-is. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { children: <CreateToastButton label="Notify me" /> },
}

/** `timeout` sets how long a toast lingers. `0` keeps it until dismissed. */
export const Timeout: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { timeout: 0 },
}

/** `limit` caps how many show at once; older ones are marked limited, not dropped. */
export const Limit: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { limit: 1, timeout: 0 },
}

/** `container` picks the portal target for the stack. */
export const Container: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { container: '#toast-container-demo', timeout: 0 },
  render: (args) => (
    <>
      <div id="toast-container-demo" />
      <ToastProvider {...args} />
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
  args: { className: 'toast-demo-inset', container: '#toast-classname-demo', timeout: 0 },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.toast-demo-inset { margin: 1rem; }`}</style>
      <div id="toast-classname-demo" />
      <ToastProvider {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The close button is `aria-hidden` until the stack is hovered or focused, so
 * a single passing notification doesn't compete with the page for keyboard
 * attention. Hover the stack to reveal it.
 */
export const CloseAppearsOnHover: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: { timeout: 0 },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * Each toast enters and leaves off `[data-starting-style]` and
 * `[data-ending-style]`, and the exit additionally reads
 * `[data-swipe-direction]` so a swiped toast leaves the way it was pushed
 * rather than fading in place.
 */
export const EnterExitTransition: Story = {
  tags: ['animation'],
  argTypes: hide('container', 'className'),
  args: { timeout: 0 },
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))
    const region = await doc.findByRole('region', { name: 'Notifications' })
    const toast = await waitFor(() => {
      const node = region.querySelector('[data-part="toast"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(toast).transitionProperty).not.toBe('none')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Portalled into a node inside the canvas via `container`, so the Anatomy
 * panel can reach the parts — it only scans the story canvas, and the default
 * portal target is the document body. A toast is raised on play so the stack
 * isn't empty.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'timeout', 'limit', 'container', 'className'),
  args: { container: '#toast-anatomy-host', timeout: 0 },
  render: (args) => (
    <>
      <div id="toast-anatomy-host" />
      <ToastProvider {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))
  },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Viewport', description: 'The stack region the toasts portal into.' },
        {
          id: 'toast',
          name: 'Toast',
          description: 'One notification; owns the enter/exit states.',
        },
        {
          id: 'content',
          name: 'Content',
          description: 'Lays the text out against the close button.',
        },
        { id: 'title', name: 'Title', description: 'The headline.' },
        { id: 'description', name: 'Description', description: 'The supporting line.' },
        {
          id: 'close',
          name: 'Close',
          description: '`aria-hidden` until the stack is hovered or focused.',
        },
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
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * gives no feedback when an item is added to the cart, which is the gap this
 * fills. The story to write: 'Added to your order — Cheeseburger ×2' raised
 * from an 'Add to cart' click, alongside a DropBoard case using
 * `useToast().promise` so a menu save reports loading, then success or
 * failure, from one call.
 */
export const MealdropAddedToCart: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestAppearsOnDemand: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const region = doc.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(region).getByText('Draft saved')).toBeVisible())
  },
}

export const TestDismissesOnClose: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const region = doc.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(region).getByText('Draft saved')).toBeVisible())

    // The close button is aria-hidden until the stack is hovered or focused,
    // so a single toast doesn't compete with the page for keyboard attention.
    await userEvent.hover(region)
    await userEvent.click(within(region).getByRole('button', { name: 'Dismiss' }))

    await waitFor(() => expect(doc.queryByText('Draft saved')).not.toBeInTheDocument(), {
      timeout: 3000,
    })
  },
}

export const TestContainerPortalsWhereAsked: Story = {
  tags: ['tests'],
  args: { container: '#toast-portal-test', timeout: 0 },
  render: (args) => (
    <>
      <div id="toast-portal-test" data-testid="portal-host" />
      <ToastProvider {...args} />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const host = canvas.getByTestId('portal-host')
    await waitFor(() => expect(host.querySelector('[data-part="toast"]')).not.toBeNull())
  },
}

import { useEffect, useRef } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import { inPortalHost } from '../../../.storybook/preview'

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

/** Raises one toast as soon as it mounts, for stories that should show the
 *  notification rather than the control that produces it. */

const RaiseOnMount = () => {
  const toast = useToast()
  // `useToast()` returns a fresh object each render, so the raise is guarded
  // rather than keyed on it — otherwise the effect re-fires forever.
  const raised = useRef(false)

  useEffect(() => {
    if (raised.current) {
      return
    }
    raised.current = true
    toast.add({ title: 'Draft saved', description: 'Your changes are stored automatically.' })
  }, [toast])

  return null
}

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
  decorators: [inPortalHost],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: { timeout: 5000, limit: 3 },
  argTypes: hide('container', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { children: <CreateToastButton label="Notify me" /> },
}

export const Timeout: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { timeout: 0 },
}

export const Limit: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'className'),
  args: { limit: 1, timeout: 0 },
}

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

export const CloseAppearsOnHover: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'className'),
  args: { timeout: 0 },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

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

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'timeout', 'limit', 'container', 'className'),
  args: { timeout: 0 },
  render: (args) => (
    // Raised on mount rather than by a click, so the canvas holds the toast
    // itself and the panel has no trigger button to scan.
    <ToastProvider {...args}>
      <RaiseOnMount />
    </ToastProvider>
  ),
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

const AddToCartButton = () => {
  const toast = useToast()

  return (
    <Button
      icon="cart"
      onClick={() =>
        toast.add({ title: 'Added to your order', description: 'Cheeseburger ×2 — €17.00' })
      }
    >
      Add to cart
    </Button>
  )
}

const SaveMenuButton = () => {
  const toast = useToast()

  return (
    <Button
      clear
      onClick={() =>
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
          loading: { title: 'Saving menu…' },
          success: { title: 'Menu saved', description: 'Diners see the new prices now.' },
          error: { title: "Couldn't save the menu", description: 'Check your connection.' },
        })
      }
    >
      Save menu
    </Button>
  )
}

export const MealdropAddedToCart: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'container', 'timeout', 'limit', 'className'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))

    await waitFor(() => expect(canvas.getByText('Added to your order')).toBeVisible())
  },
  render: (args) => (
    <ToastProvider container={args.container}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <AddToCartButton />
        <SaveMenuButton />
      </div>
    </ToastProvider>
  ),
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

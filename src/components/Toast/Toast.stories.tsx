import { useEffect, useRef } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

import { Button } from '../Button'

import { inPortalHost } from '../../../.storybook/preview'

import type { ToastProviderProps } from './Toast'
import { ToastProvider, useToast } from './Toast'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ToastProviderProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
 * portal target is the document body. A toast is raised on play so the stack
 * isn't empty.
 */
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

/** Adding to a cart, and saving a menu. */
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

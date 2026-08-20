import { useEffect, useRef } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

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
/* tests — assertions only, one behaviour each                         */

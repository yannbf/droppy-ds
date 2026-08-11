import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import { ToastProvider, useToast } from './Toast'

const CreateToastButton = () => {
  const toast = useToast()

  return (
    <Button
      onClick={() =>
        toast.add({
          title: 'Draft saved',
          description: 'Your changes are stored automatically.',
        })
      }
    >
      Save draft
    </Button>
  )
}

const meta = {
  title: 'Feedback & status/Toast',
  component: ToastProvider,
  args: {
    children: <CreateToastButton />,
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

export const Default: Story = {}

/** A toast reports its own dismissal — waiting past its timeout removes it
 *  from the stack without any action from the reader. */
export const AppearsOnDemand: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const toastRegion = body.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(toastRegion).getByText('Draft saved')).toBeVisible())
  },
}

/** Clicking `Dismiss` closes the toast immediately, without waiting out its
 *  timeout. */
export const DismissesOnClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const toastRegion = body.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(toastRegion).getByText('Draft saved')).toBeVisible())

    // The close button is aria-hidden until the stack is hovered or focused,
    // so a single toast doesn't compete with the page for keyboard attention.
    await userEvent.hover(toastRegion)
    await userEvent.click(within(toastRegion).getByRole('button', { name: 'Dismiss' }))

    await waitFor(() => expect(body.queryByText('Draft saved')).not.toBeInTheDocument(), {
      timeout: 3000,
    })
  },
}

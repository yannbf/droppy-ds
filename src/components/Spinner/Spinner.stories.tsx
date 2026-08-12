import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Spinner } from './Spinner'

const meta = {
  title: 'Feedback & status/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `label` overrides the accessible name announced to screen readers — the
 *  graphic itself stays `aria-hidden`. */
export const CustomLabel: Story = {
  args: { label: 'Loading your order' },
}

/** The visible graphic is `aria-hidden`; a visually-hidden label carries the
 *  accessible name on the `status` role instead. */
export const AnnouncesLoading: Story = {
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status', { name: 'Loading' })

    await expect(status).toBeInTheDocument()
  },
}

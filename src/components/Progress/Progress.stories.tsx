import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Progress } from './Progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 40, label: 'Uploading files', showValue: true },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Determinate: Story = {
  args: { value: 40 },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuenow', '40')
    await expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    await expect(canvas.getByText('40%')).toBeVisible()
  },
}

/** `value={null}` (or omitting it) renders an indeterminate bar — `aria-valuenow` is
 *  omitted entirely, for a wait whose length isn't known. */
export const Indeterminate: Story = {
  args: { value: null, showValue: false },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).not.toHaveAttribute('aria-valuenow')
    await expect(progressbar).toHaveAttribute('data-indeterminate')
  },
}

export const Complete: Story = {
  args: { value: 100 },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuenow', '100')
    await expect(progressbar).toHaveAttribute('data-complete')
  },
}

/** A custom `max` still reports the percentage of the full range. */
export const CustomRange: Story = {
  args: { value: 30, max: 40 },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuemax', '40')
    await expect(canvas.getByText('75%')).toBeVisible()
  },
}

export const WithoutValueText: Story = {
  args: { showValue: false },
}

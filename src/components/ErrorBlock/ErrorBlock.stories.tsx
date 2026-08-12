import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ErrorBlock } from './ErrorBlock'

const sushiIllustration = (
  <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="56" fill="var(--ds-color-surface-sunken)" />
    <circle cx="60" cy="60" r="34" fill="var(--ds-palette-neutral-0)" />
    <circle cx="60" cy="60" r="14" fill="var(--ds-palette-brand-200)" />
  </svg>
)

const meta = {
  title: 'Feedback & status/ErrorBlock',
  component: ErrorBlock,
  args: {
    title: 'This is not the food you’re looking for.',
    body: 'There seems that there are no restaurants in this category yet. Try to come back later?',
    buttonText: 'See all restaurants',
    onButtonClick: fn(),
  },
} satisfies Meta<typeof ErrorBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: {
    illustration: sushiIllustration,
  },
}

/** The illustration slot is optional — omitted, the block renders with just the
 *  title, body, and action. */
export const WithoutIllustration: Story = {
  tags: ['api-ref'],
}

export const ActionIsReachable: Story = {
  tags: ['tests'],
  args: {
    illustration: sushiIllustration,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'See all restaurants' })

    await expect(button).toBeVisible()
  },
}

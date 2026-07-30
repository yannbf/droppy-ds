import type { Meta, StoryObj } from '@storybook/react-vite'
import isChromatic from 'chromatic/isChromatic'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    label: 'turn on dark mode',
    children: <Button round clear icon="moon" aria-label="turn on dark mode" />,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The tip repeats the trigger's accessible name rather than replacing it — a
 *  tooltip is never the only place the label lives. */
export const ShowsOnHover: Story = {
  play: async ({ canvasElement }) => {
    // Chromatic's capture sends synthetic pointer events, which the hover
    // logic ignores — the vitest run drives a real browser and covers this.
    if (isChromatic()) return

    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.hover(canvas.getByRole('button', { name: 'turn on dark mode' }))

    await waitFor(() => expect(body.getByText('turn on dark mode')).toBeVisible())
  },
}

export const ShowsOnFocus: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.tab()

    await waitFor(() => expect(body.getByText('turn on dark mode')).toBeVisible())
  },
}

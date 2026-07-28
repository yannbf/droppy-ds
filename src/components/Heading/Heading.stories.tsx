import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Heading } from './Heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: { children: 'Best food in town' },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Levels: Story = {
  render: (args) => (
    <>
      {([1, 2, 3, 4, 5] as const).map((level) => (
        <Heading {...args} key={level} level={level}>
          Level {level}
        </Heading>
      ))}
    </>
  ),
}

/** `level` picks the tag as well as the size — a page keeps one `h1` and does
 *  not skip levels, so the outline stays navigable. */
export const RendersMatchingTag: Story = {
  args: { level: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument()
  },
}

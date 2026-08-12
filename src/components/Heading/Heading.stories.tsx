import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Heading } from './Heading'

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Best food in town' },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['api-ref'],
}

export const Levels: Story = {
  tags: ['showcase'],
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
  tags: ['highlight'],
  args: { level: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument()
  },
}

/** `size` picks the visual size step on its own — the tag still follows
 *  `level`, so a card title can stay an `h2` in the outline while looking
 *  like a level-4 heading. */
export const SizeDecoupledFromLevel: Story = {
  tags: ['highlight'],
  args: { level: 2, size: 4 },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2 })

    await expect(heading).toHaveClass('droppy-Heading--4')
    await expect(heading).not.toHaveClass('droppy-Heading--2')
  },
}

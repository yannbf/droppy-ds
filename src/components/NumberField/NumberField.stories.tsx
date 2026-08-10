import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { NumberField } from './NumberField'

const meta = {
  title: 'Forms & input/NumberField',
  component: NumberField,
  args: { label: 'Quantity', defaultValue: 1, onValueChange: fn() },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Typing a value fires `onValueChange` with the parsed number. */
export const Typing: Story = {
  args: { defaultValue: undefined },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox')

    await userEvent.clear(input)
    await userEvent.type(input, '42')

    await waitFor(() => expect(input).toHaveValue('42'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(42, expect.anything())
  },
}

export const IncrementAndDecrement: Story = {
  args: { defaultValue: 5 },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await waitFor(() => expect(input).toHaveValue('6'))

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await waitFor(() => expect(input).toHaveValue('4'))
  },
}

/** The stepper buttons disable once the value reaches `min`/`max` rather than wrapping. */
export const MinMaxClamping: Story = {
  args: { defaultValue: 9, min: 0, max: 10 },
  play: async ({ canvas }) => {
    const increment = canvas.getByRole('button', { name: 'Increase' })
    const decrement = canvas.getByRole('button', { name: 'Decrease' })

    await userEvent.click(increment)
    await waitFor(() => expect(increment).toHaveAttribute('aria-disabled', 'true'))
    await expect(decrement).toHaveAttribute('aria-disabled', 'false')
  },
}

export const Disabled: Story = {
  args: { defaultValue: 3, disabled: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox')
    const increment = canvas.getByRole('button', { name: 'Increase' })

    await expect(input).toBeDisabled()
    await expect(increment).toHaveAttribute('data-disabled')
  },
}

/**
 * Dragging the label steps the value, in addition to typing and the
 * buttons — the scrub area sits behind the label text.
 */
export const Scrub: Story = {
  args: { defaultValue: 100 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveValue('100')

    const scrubArea = canvasElement.querySelector('[role="presentation"]') as HTMLElement
    const box = scrubArea.getBoundingClientRect()
    const start = { clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }

    scrubArea.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, ...start }))
    scrubArea.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: start.clientX + 10,
        clientY: start.clientY,
        movementX: 10,
        movementY: 0,
      })
    )
    await waitFor(() => expect(input).toHaveValue('110'))

    scrubArea.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
  },
}

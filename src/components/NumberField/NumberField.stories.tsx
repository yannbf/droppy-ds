import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import type { NumberFieldProps } from './NumberField'
import { NumberField } from './NumberField'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof NumberFieldProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

const meta = {
  title: 'Forms & input/NumberField',
  component: NumberField,
  args: { label: 'Quantity', defaultValue: 1, onValueChange: fn() },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Also the accessible name, and the scrub handle.',
    },
    defaultValue: { control: 'number', description: 'Starting value, uncontrolled.' },
    value: {
      control: false,
      description: 'The value, for a controlled field. Pair with `onValueChange`.',
    },
    onValueChange: {
      description: 'Receives the parsed number, or `null` when the field is empty.',
    },
    min: { control: 'number', description: 'Lower bound. The decrement disables here.' },
    max: { control: 'number', description: 'Upper bound. The increment disables here.' },
    step: { control: 'number', description: 'How much each increment moves the value.' },
    disabled: { control: 'boolean', description: 'Disables the input and both buttons.' },
    format: {
      control: false,
      description: '`Intl.NumberFormat` options — currency, percent, decimals.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-NumberField` class.',
    },
  },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A typeable quantity with stepper buttons. Bounds and step are set below, so
 * the controls start populated — the buttons disable at the bounds rather than
 * wrapping.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'Quantity', defaultValue: 1, min: 0, max: 10, step: 1, disabled: false },
  argTypes: hide('value', 'format', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` names the field and doubles as the scrub handle. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { label: 'Servings' },
}

/** `defaultValue` seeds the field without making it controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 5 },
}

/** `min` and `max` bound the range; the buttons disable at each end. */
export const MinAndMax: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 9, min: 0, max: 10 },
}

/** `step` sets how far each increment moves. */
export const Step: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 1, step: 0.5 },
}

/** `format` takes `Intl.NumberFormat` options — currency, percent, decimals. */
export const Format: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: {
    label: 'Price',
    defaultValue: 8.5,
    step: 0.25,
    format: { style: 'currency', currency: 'EUR' },
  },
}

/** `disabled` dims the input and both buttons together. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 3, disabled: true },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format'),
  args: { className: 'numberfield-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.numberfield-demo-inset { margin: 1rem; }`}</style>
      <NumberField {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Three ways in, not one: type a value, press the buttons, or drag the label
 * itself — the scrub area sits behind the label text. That third route is what
 * separates this from `QuantityStepper`, which only does tap-tap increments.
 */
export const ThreeWaysToChangeTheValue: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 100 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A field wrapper, the scrub area holding the label, and the button group. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'defaultValue', 'value', 'min', 'max', 'step', 'format', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'field',
          name: 'Field',
          description: 'Base UI’s `Field.Root`, which associates the label with the input.',
        },
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the value, the bounds, and the formatting.',
        },
        {
          id: 'scrub',
          name: 'Scrub area',
          description: 'Wraps the label; dragging it steps the value.',
        },
        { id: 'label', name: 'Label', description: 'The visible label and accessible name.' },
        { id: 'group', name: 'Group', description: 'Holds the two buttons and the input.' },
        { id: 'decrement', name: 'Decrement', description: 'The minus; disabled at `min`.' },
        { id: 'input', name: 'Input', description: 'The typeable control.' },
        { id: 'increment', name: 'Increment', description: 'The plus; disabled at `max`.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * only ever needs bounded tap-tap quantities, which is `QuantityStepper`'s
 * job. The story to write is a DropBoard one: the menu item's price editor —
 * a `format`-ed euro field with `step={0.25}` beside a prep-time field in
 * minutes — since a partner types an exact price rather than clicking up to
 * it, and the scrub handle makes small adjustments quick. Worth showing beside
 * a `QuantityStepper` to make the choice between them concrete.
 */
export const DropBoardPriceEditor: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestTypingReportsAParsedNumber: Story = {
  tags: ['tests'],
  args: { defaultValue: undefined },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox')

    await userEvent.clear(input)
    await userEvent.type(input, '42')

    await waitFor(() => expect(input).toHaveValue('42'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(42, expect.anything())
  },
}

export const TestIncrementAndDecrement: Story = {
  tags: ['tests'],
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

export const TestButtonsDisableAtBounds: Story = {
  tags: ['tests'],
  args: { defaultValue: 9, min: 0, max: 10 },
  play: async ({ canvas }) => {
    const increment = canvas.getByRole('button', { name: 'Increase' })
    const decrement = canvas.getByRole('button', { name: 'Decrease' })

    await userEvent.click(increment)
    await waitFor(() => expect(increment).toHaveAttribute('aria-disabled', 'true'))
    await expect(decrement).toHaveAttribute('aria-disabled', 'false')
  },
}

export const TestDisabledBlocksEverything: Story = {
  tags: ['tests'],
  args: { defaultValue: 3, disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Increase' })).toHaveAttribute('data-disabled')
  },
}

export const TestScrubbingTheLabel: Story = {
  tags: ['tests'],
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

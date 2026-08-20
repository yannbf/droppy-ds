import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { NumberFieldProps } from './NumberField'
import { NumberField } from './NumberField'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof NumberFieldProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
/* tests — assertions only, one behaviour each                         */

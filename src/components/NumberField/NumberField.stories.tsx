import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { NumberField } from './NumberField'

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
}

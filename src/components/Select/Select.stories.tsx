import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Select } from './Select'

const meta = {
  title: 'Forms & input/Select',
  component: Select,
  args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, onChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'Visible label, rendered above the control.' },
    options: {
      control: 'object',
      description: 'Option values. Each is rendered as both the value and the visible text.',
    },
    value: { control: 'text', description: 'The selected value.' },
    onChange: {
      description: 'Receives the selected value, coerced to a number when the option is numeric.',
    },
    disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Select` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

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

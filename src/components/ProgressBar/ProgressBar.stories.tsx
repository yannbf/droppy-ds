import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Feedback & status/ProgressBar',
  component: ProgressBar,
  args: { value: 1, max: 3, label: 'Checkout progress' },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'How far along the track the fill sits. Clamped to 0–`max` before the DOM.',
    },
    max: { control: 'number', description: 'Upper bound `value` is measured against.' },
    label: {
      control: 'text',
      description: 'Accessible name. The visible copy around the bar is the caller’s own markup.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ProgressBar` class.',
    },
  },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>

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
  args: { value: 1 },
}

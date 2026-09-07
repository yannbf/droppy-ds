import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  args: {
    label: 'turn on dark mode',
    children: <Button round clear icon="moon" aria-label="turn on dark mode" />,
  },
  argTypes: {
    label: { control: 'text', description: 'The tip’s content.' },
    children: {
      control: false,
      description: 'The element the tip describes. Rendered as the trigger itself, not wrapped.',
    },
    sideOffset: { control: 'number', description: 'Gap between the trigger and the tip.' },
    className: {
      control: 'text',
      description: 'Merged onto the popup alongside the component’s own `droppy-Tooltip` class.',
    },
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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: {
    label: 'turn on dark mode',
    children: <Button round clear icon="moon" aria-label="turn on dark mode" />,
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'

import type { TabItem } from './Tabs'
import { Tabs } from './Tabs'

type Tab = TabItem & { label: string; content: string }

// A fixed-length tuple, not a plain array, so indexed access below doesn't
// need non-null assertions under `noUncheckedIndexedAccess`.
const tabs: readonly [Tab, Tab, Tab] = [
  { value: 'overview', label: 'Overview', content: 'Order stats and recent activity.' },
  { value: 'items', label: 'Items', content: 'Menu items and pricing.' },
  { value: 'settings', label: 'Settings', content: 'Store hours and preferences.' },
]

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { tabs: [...tabs], defaultValue: 'overview' },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'The set, as `{ value, label, content, disabled? }`. Order is render order.',
    },
    defaultValue: {
      control: 'text',
      description: 'The tab active on first render, for an uncontrolled Tabs.',
    },
    value: {
      // Setting `value` from the panel would make Tabs controlled with nothing
      // driving it, freezing the active tab. ControlledValue shows the pairing.
      control: false,
      description: 'The active tab value, for a controlled Tabs. Pair with `onValueChange`.',
    },
    onValueChange: { description: 'Called with the newly active tab’s value.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Tabs` class.',
    },
  },
} satisfies Meta<typeof Tabs>

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

type Order = { id: string; placedAt: string; customer: string; items: string; total: number }

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: {
    tabs: [
      { value: 'one', label: 'One', content: 'Content for tab one' },
      { value: 'two', label: 'Two', content: 'Content for tab two' },
    ],
  },
}

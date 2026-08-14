import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { TabItem, TabsProps } from './Tabs'
import { Tabs } from './Tabs'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TabsProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/** The tab row, its indicator, and one panel per tab. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('tabs', 'defaultValue', 'value', 'onValueChange', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the active value and links tabs to panels.',
        },
        { id: 'list', name: 'List', description: 'The `role="tablist"` row.' },
        { id: 'tab', name: 'Tab', description: 'One button per entry, carrying `aria-selected`.' },
        {
          id: 'indicator',
          name: 'Indicator',
          description: 'The sliding underline; writes the active tab’s position as CSS variables.',
        },
        { id: 'viewport', name: 'Viewport', description: 'Wraps the panels.' },
        {
          id: 'panel',
          name: 'Panel',
          description: 'One per tab; only the active one is shown.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

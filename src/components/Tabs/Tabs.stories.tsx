import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Separator } from '../Separator'

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

const euros = (amount: number) =>
  amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

type Order = { id: string; placedAt: string; customer: string; items: string; total: number }

const ordersByStatus: Record<string, Order[]> = {
  kitchen: [
    {
      id: 'DB-2291',
      placedAt: '13:02',
      customer: 'Ada Lovelace',
      items: '2× Cheeseburger, 1× Fries',
      total: 19.5,
    },
    {
      id: 'DB-2292',
      placedAt: '13:08',
      customer: 'Katherine Johnson',
      items: '1× Cheeseburger, 2× Sprite',
      total: 11.5,
    },
  ],
  courier: [
    {
      id: 'DB-2290',
      placedAt: '12:47',
      customer: 'Grace Hopper',
      items: '1× Cheeseburger, 2× Coca-Cola',
      total: 12,
    },
  ],
  delivered: [
    {
      id: 'DB-2289',
      placedAt: '12:31',
      customer: 'Alan Turing',
      items: '2× Fries, 1× Vanilla ice cream',
      total: 7,
    },
    {
      id: 'DB-2288',
      placedAt: '12:04',
      customer: 'Barbara Liskov',
      items: '3× Cheeseburger',
      total: 25.5,
    },
  ],
}

const OrderList = ({ orders }: { orders: Order[] }) => (
  <div style={{ display: 'grid', gap: '0.75rem', paddingTop: '1rem' }}>
    {orders.map((order, index) => (
      <div key={order.id} style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.125rem' }}>
            <Body size="S" fontWeight="bold">
              {order.id} · {order.customer}
            </Body>
            <Body size="XS">{order.items}</Body>
          </div>
          <div style={{ display: 'grid', gap: '0.125rem', textAlign: 'right' }}>
            <Body size="S" fontWeight="bold">
              {euros(order.total)}
            </Body>
            <Body size="XS">{order.placedAt}</Body>
          </div>
        </div>
        {index < orders.length - 1 && <Separator />}
      </div>
    ))}
  </div>
)

/** DropBoard's order queue, split by where each order has got to. */
export const DropBoardOrderQueue: Story = {
  tags: ['examples'],
  argTypes: hide('tabs', 'value', 'defaultValue', 'onValueChange', 'className'),
  render: () => (
    <div style={{ maxWidth: '32rem' }}>
      <Tabs
        defaultValue="kitchen"
        tabs={[
          {
            value: 'kitchen',
            label: 'In the kitchen',
            content: <OrderList orders={ordersByStatus.kitchen ?? []} />,
          },
          {
            value: 'courier',
            label: 'Out for delivery',
            content: <OrderList orders={ordersByStatus.courier ?? []} />,
          },
          {
            value: 'delivered',
            label: 'Delivered',
            content: <OrderList orders={ordersByStatus.delivered ?? []} />,
          },
        ]}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

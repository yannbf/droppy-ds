import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { NumberField } from '../NumberField'
import { Select } from '../Select'

import type { AccordionItem, AccordionProps } from './Accordion'
import { Accordion } from './Accordion'

type Faq = AccordionItem & { value: string; title: string; content: string }

/**
 * Hides props from a story's controls and args table. Every story hides the
 * half of the controlled/uncontrolled pair it doesn't use — `value` and
 * `defaultValue` together would silently fight — plus anything that isn't the
 * point of that story, so its controls stay actionable. The full table is
 * still rendered from the meta by `<ArgTypes>` on the docs page.
 */
const hide = (...props: Array<keyof AccordionProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

/** Everything but `items`, for stories where only the content matters. */
const ALL_BUT_ITEMS: Array<keyof AccordionProps> = [
  'value',
  'defaultValue',
  'openMultiple',
  'onValueChange',
  'className',
]

// A fixed-length tuple, not a plain array, so indexed access below doesn't
// need non-null assertions under `noUncheckedIndexedAccess`.
const deliveryFaq: readonly [Faq, Faq, Faq] = [
  {
    value: 'delivery-time',
    title: 'How long will my order take?',
    content:
      'Most orders arrive within 25–40 minutes. You’ll see a live estimate on the order page once the restaurant accepts it.',
  },
  {
    value: 'delivery-area',
    title: 'Do you deliver to my address?',
    content:
      'Enter your postcode on the home page and we’ll show only the restaurants that deliver to you.',
  },
  {
    value: 'order-changes',
    title: 'Can I change my order after paying?',
    content:
      'Until the restaurant accepts it, yes. Open the order and tap Edit. After that, we can no longer modify orders, as restaurants are too busy to handle last-second changes.',
  },
]

const meta = {
  title: 'Layout & structure/Accordion',
  component: Accordion,
  args: {
    items: [...deliveryFaq],
    onValueChange: fn(),
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The sections to render, as `{ value?, title, content, disabled? }`. `value` falls back to the item’s index when omitted.',
    },
    openMultiple: {
      control: 'boolean',
      description: 'Allows more than one item to stay open at once. Single-open when omitted.',
    },
    defaultValue: {
      control: 'object',
      description: 'The item values open on first render, for an uncontrolled accordion.',
    },
    value: {
      // Setting `value` from the controls panel would make the accordion
      // controlled without an `onValueChange` wired to state, freezing it
      // half-open. The ControlledValue story shows the working pairing.
      control: false,
      description:
        'The open item values, for a controlled accordion. Pair with `onValueChange` — see the ControlledValue story.',
    },
    onValueChange: {
      description: 'Called with the full array of open item values whenever it changes.',
    },
    className: {
      // Kept in the meta so the API reference table lists it, then hidden per
      // story — every story except ClassName passes it to `hide()`.
      control: 'text',
      description: 'Merged onto the root alongside the theme’s own classes.',
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A customer-facing delivery FAQ: three independent questions, one open at a
 * time. Every prop worth playing with is set explicitly below, so the controls
 * start populated — toggle `openMultiple`, seed a different `defaultValue`, or
 * edit the items directly.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    items: [...deliveryFaq],
    openMultiple: false,
    onValueChange: fn(),
    defaultValue: ['delivery-time'],
  },
  argTypes: hide('value', 'onValueChange', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/**
 * `items` is the only required prop. With `value` omitted, each item is keyed
 * by its index — so `defaultValue={['1']}` opens the second one.
 */
export const Items: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'className'),
  args: {
    items: [
      { title: 'Payment methods', content: 'iDEAL, credit card, and Apple Pay.' },
      { title: 'Refunds', content: 'Refunds land back on your card within 3–5 working days.' },
    ],
    defaultValue: ['1'],
  },
}

/** Giving each item an explicit `value` decouples the open state from list order. */
export const ItemValues: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'className'),
  args: {
    defaultValue: ['order-changes'],
  },
}

/**
 * `title` and `content` are `ReactNode`, not strings — a title can carry a
 * badge, and content can be any markup.
 */
export const RichContent: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'className'),
  args: {
    items: [
      {
        value: 'loyalty',
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Droppy Rewards
            <Badge text="new" variant="positive" />
          </span>
        ),
        content: (
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            <li>€1 spent = 1 point</li>
            <li>100 points = free delivery</li>
            <li>Points never expire</li>
          </ul>
        ),
      },
      {
        value: 'allergens',
        title: 'Allergen information',
        content: (
          <Body size="XS">
            Every menu item lists its allergens. Ask the restaurant directly about
            cross-contamination.
          </Body>
        ),
      },
    ],
    defaultValue: ['loyalty'],
  },
}

/** A disabled item's trigger stays focusable, but never toggles its panel. */
export const DisabledItem: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'defaultValue', 'openMultiple', 'onValueChange', 'className'),
  args: {
    items: [deliveryFaq[0], { ...deliveryFaq[1], disabled: true }, deliveryFaq[2]],
  },
}

/** `openMultiple` lets several panels stay open at once. */
export const OpenMultiple: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange', 'className'),
  args: {
    openMultiple: true,
    defaultValue: ['delivery-time', 'delivery-area'],
  },
}

/** `defaultValue` seeds the open items without making the accordion controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'className'),
  args: {
    defaultValue: ['delivery-area'],
  },
}

function ControlledAccordion({ onValueChange, ...args }: React.ComponentProps<typeof Accordion>) {
  const [value, setValue] = useState<string[]>(['delivery-time'])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Accordion
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onValueChange?.(next)
        }}
      />
      <Body size="XS">Open: {value.length > 0 ? value.join(', ') : 'none'}</Body>
    </div>
  )
}

/**
 * `value` and `onValueChange` together drive the open state from outside the
 * component — the pair is what makes it controlled, and one without the other
 * leaves the accordion stuck.
 */
export const ControlledValue: Story = {
  tags: ['api-ref', 'highlight'],
  // `openMultiple` stays visible: it composes with a controlled value.
  argTypes: hide('defaultValue', 'className'),
  render: (args) => <ControlledAccordion {...args} />,
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'defaultValue', 'openMultiple', 'onValueChange'),
  args: {
    className: 'accordion-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.accordion-demo-inset { margin: 1rem; }`}</style>
      <Accordion {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * The seven parts an Accordion renders. Hover an entry in the Anatomy panel to
 * highlight it in the canvas, or hover the canvas to activate the entry. One
 * item starts open, since the panel and content parts only mount while open.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: { defaultValue: ['delivery-time'] },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the shared open state, the border, and the column layout.',
        },
        {
          id: 'item',
          name: 'Item',
          description: 'One collapsible section. Carries `[data-panel-open]` while open.',
        },
        {
          id: 'header',
          name: 'Header',
          description: 'The `<h3>` wrapper that puts each trigger in the page outline.',
        },
        {
          id: 'trigger',
          name: 'Trigger',
          description: 'The `<button>` that toggles its panel, carrying `aria-expanded`.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The plus glyph, rotated 45° into a cross while the item is open.',
        },
        {
          id: 'panel',
          name: 'Panel',
          description:
            'The animated region, mounted only while open; its height comes from `--accordion-panel-height`.',
        },
        {
          id: 'content',
          name: 'Content',
          description: 'The padded inner wrapper that the panel clips as it animates.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Single-open is the default: opening a second item closes the first, so the
 * list never grows past one panel's worth of height.
 */
export const SingleOpenReplaces: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'defaultValue', 'onValueChange', 'className'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: deliveryFaq[0].title }))
    await userEvent.click(canvas.getByRole('button', { name: deliveryFaq[1].title }))
  },
}

/* ------------------------------------------------------------------ */
/* animation — the open/close transition contract                      */
/* ------------------------------------------------------------------ */

/**
 * Base UI measures the panel and writes its height to
 * `--accordion-panel-height`; the theme transitions `height` on top of that,
 * and rotates the trigger's plus icon 45° into a cross via `[data-panel-open]`.
 * This asserts the mechanism — the variable actually resolves to a measured
 * height — rather than trusting the visible sweep.
 */
export const PanelHeightTransition: Story = {
  tags: ['animation'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const icon = trigger.querySelector('.AccordionIcon') as HTMLElement

    await expect(getComputedStyle(icon).transitionProperty).toContain('transform')

    // The panel only mounts once its item opens, so it can't be queried before.
    await userEvent.click(trigger)
    const panel = await waitFor(() => {
      const node = canvasElement.querySelector('.AccordionPanel')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(panel).transitionProperty).toContain('height')

    // Base UI writes the measured height to the variable the theme animates;
    // 'auto' is the pre-measurement value, so wait for real pixels.
    await waitFor(() =>
      expect(panel.style.getPropertyValue('--accordion-panel-height')).toMatch(/^[1-9][\d.]*px$/)
    )
    await waitFor(() => expect(getComputedStyle(icon).transform).not.toBe('none'))
  },
}

/* ------------------------------------------------------------------ */
/* examples — DropBoard, the restaurant-partner back office            */
/* ------------------------------------------------------------------ */

const PROMOTIONS = ['No promotion', '10% off', '2 for 1', 'Free with €20+'] as const

type MenuRow = {
  id: string
  name: string
  price: number
  promotion: (typeof PROMOTIONS)[number]
  available: boolean
}

// Mealdrop's own menu and prices (`src/stub/restaurants.ts` on
// `agentic-reference/droppy`), with the back office's editable fields added.
const initialMenu: MenuRow[] = [
  { id: 'cheeseburger', name: 'Cheeseburger', price: 8.5, promotion: '2 for 1', available: true },
  { id: 'fries', name: 'Fries', price: 2.5, promotion: 'No promotion', available: true },
  {
    id: 'vanilla-ice-cream',
    name: 'Vanilla ice cream',
    price: 2,
    promotion: 'No promotion',
    available: false,
  },
  { id: 'coca-cola', name: 'Coca-Cola', price: 1.75, promotion: '10% off', available: true },
  { id: 'sprite', name: 'Sprite', price: 1.5, promotion: 'No promotion', available: true },
]

const euros = (amount: number) =>
  amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

function MenuEditor({ items: _items, ...args }: React.ComponentProps<typeof Accordion>) {
  const [menu, setMenu] = useState(initialMenu)

  const patch = (id: string, next: Partial<MenuRow>) =>
    setMenu((rows) => rows.map((row) => (row.id === id ? { ...row, ...next } : row)))

  return (
    <Accordion
      {...args}
      items={menu.map((row) => ({
        value: row.id,
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {row.name}
            {row.promotion !== 'No promotion' && <Badge text="promo" variant="positive" />}
            {!row.available && <Badge text="sold out" />}
          </span>
        ),
        content: (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <NumberField
              label="Price"
              value={row.price}
              onValueChange={(next) => patch(row.id, { price: next ?? 0 })}
              min={0}
              step={0.25}
              format={{ style: 'currency', currency: 'EUR' }}
            />
            <Select
              label="Promotion"
              options={[...PROMOTIONS]}
              value={row.promotion}
              onChange={(next) => patch(row.id, { promotion: next as MenuRow['promotion'] })}
            />
            <Select
              label="Availability"
              options={['Available', 'Sold out']}
              value={row.available ? 'Available' : 'Sold out'}
              onChange={(next) => patch(row.id, { available: next === 'Available' })}
            />
          </div>
        ),
      }))}
    />
  )
}

/**
 * DropBoard's menu editor: one collapsible row per dish, each opening onto the
 * three fields a partner actually changes — price, a running promotion, and
 * whether the kitchen is still serving it. A promo badge surfaces in the header
 * so the list can be scanned without opening anything, and every row starts
 * closed because a partner arrives looking for one dish, not all of them.
 *
 * The badges are driven by the same state as the fields, so changing a row's
 * promotion or availability updates its header immediately.
 */
export const DropBoardMenuEditor: Story = {
  tags: ['examples'],
  argTypes: hide('items', 'value', 'defaultValue', 'className'),
  args: { openMultiple: false },
  render: (args) => <MenuEditor {...args} />,
}

type OrderStatus = 'In the kitchen' | 'Out for delivery' | 'Delivered'

type Order = {
  id: string
  placedAt: string
  customer: string
  status: OrderStatus
  lines: Array<{ item: string; quantity: number; price: number }>
}

/** Anything not yet handed over is still the kitchen's problem. */
const isOpenOrder = (status: OrderStatus) => status !== 'Delivered'

const orders: Order[] = [
  {
    id: 'DB-2291',
    placedAt: '13:02',
    customer: 'Ada Lovelace',
    status: 'In the kitchen',
    lines: [
      { item: 'Cheeseburger', quantity: 2, price: 8.5 },
      { item: 'Fries', quantity: 1, price: 2.5 },
    ],
  },
  {
    id: 'DB-2290',
    placedAt: '12:47',
    customer: 'Grace Hopper',
    status: 'Out for delivery',
    lines: [
      { item: 'Cheeseburger', quantity: 1, price: 8.5 },
      { item: 'Coca-Cola', quantity: 2, price: 1.75 },
    ],
  },
  {
    id: 'DB-2289',
    placedAt: '12:31',
    customer: 'Alan Turing',
    status: 'Delivered',
    lines: [
      { item: 'Fries', quantity: 2, price: 2.5 },
      { item: 'Vanilla ice cream', quantity: 1, price: 2 },
    ],
  },
  {
    id: 'DB-2288',
    placedAt: '12:04',
    customer: 'Katherine Johnson',
    status: 'Delivered',
    lines: [{ item: 'Cheeseburger', quantity: 1, price: 8.5 }],
  },
]

const orderTotal = (order: Order) =>
  order.lines.reduce((sum, line) => sum + line.quantity * line.price, 0)

// Newest first: the orders still in play are the most recent ones, so
// reverse-chronological puts everything actionable at the top.
const orderedByTime = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt))

/**
 * DropBoard's order feed: everything from today in one column, newest first,
 * so the orders still in play sit at the top. The two that haven't been handed
 * over yet carry a status badge in the header and start open — the partner's
 * actual work — while delivered orders collapse into plain rows kept for
 * reference.
 */
export const DropBoardOrders: Story = {
  tags: ['examples'],
  argTypes: hide('value', 'className'),
  args: {
    openMultiple: true,
    defaultValue: orderedByTime.filter((order) => isOpenOrder(order.status)).map((o) => o.id),
    items: orderedByTime.map((order) => ({
      value: order.id,
      title: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>
            {order.placedAt} · {order.customer}
          </span>
          {isOpenOrder(order.status) && <Badge text={order.status} variant="positive" />}
        </span>
      ),
      content: (
        <div style={{ display: 'grid', gap: '0.25rem' }}>
          {order.lines.map((line) => (
            <Body key={line.item} size="XS">
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>
                  {line.quantity} × {line.item}
                </span>
                <span>{euros(line.quantity * line.price)}</span>
              </span>
            </Body>
          ))}
          <Body size="XS" fontWeight="bold">
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <span>Total</span>
              <span>{euros(orderTotal(order))}</span>
            </span>
          </Body>
          <Body size="XXS">
            Order {order.id} · {order.status}
          </Body>
        </div>
      ),
    })),
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestSingleOpen: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(canvas.getByText(deliveryFaq[0].content)).toBeVisible())

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Opening item 2 replaced item 1 — only one item is open at a time.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  },
}

export const TestOpenMultiple: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: { openMultiple: true },
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Both stay open at once under `openMultiple`.
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true')
  },
}

export const TestDisabledItem: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: {
    items: [deliveryFaq[0], { ...deliveryFaq[1], disabled: true }, deliveryFaq[2]],
  },
  play: async ({ canvas }) => {
    const disabledTrigger = canvas.getByRole('button', { name: deliveryFaq[1].title })

    disabledTrigger.focus()
    await expect(disabledTrigger).toHaveFocus()

    await userEvent.click(disabledTrigger)
    await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(deliveryFaq[1].content)).not.toBeInTheDocument()
  },
}

export const TestControlledValue: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  render: (args) => <ControlledAccordion {...args} />,
  play: async ({ args, canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    // Seeded open by the wrapper's state, not by `defaultValue`.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)

    await expect(args.onValueChange).toHaveBeenCalledWith(['delivery-area'])
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  },
}

/**
 * No arrow-key navigation between headers by design (Base UI's Accordion
 * removed roving focus to match the current W3C APG pattern) — only Tab
 * order moves focus between triggers, and Space toggles the focused one.
 */
export const TestKeyboardTabFlow: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    trigger1.focus()
    await expect(trigger1).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(trigger1).toHaveFocus()
    await expect(trigger2).not.toHaveFocus()

    await userEvent.tab()
    await waitFor(() => expect(trigger2).toHaveFocus())

    await userEvent.keyboard(' ')
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
  },
}

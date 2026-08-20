import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

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

/* ------------------------------------------------------------------ */
/* animation — the open/close transition contract                      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* examples — DropBoard, the restaurant-partner back office            */

type OrderStatus = 'In the kitchen' | 'Out for delivery' | 'Delivered'

type Order = {
  id: string
  placedAt: string
  customer: string
  status: OrderStatus
  lines: Array<{ item: string; quantity: number; price: number }>
}

// Newest first: the orders still in play are the most recent ones, so
// reverse-chronological puts everything actionable at the top.

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

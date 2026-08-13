import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import { Badge } from '../Badge'
import { Body } from '../Body'

import type { AccordionItem } from './Accordion'
import { Accordion } from './Accordion'

type Faq = AccordionItem & { value: string; title: string; content: string }

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
      'Until the restaurant accepts it, yes — open the order and tap Edit. After that, contact the restaurant directly.',
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
      control: 'text',
      description: 'Merged onto the root alongside the theme’s own classes.',
    },
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A customer-facing delivery FAQ: three independent questions, one open at a
 * time. Use the controls to try `openMultiple`, seed `defaultValue`, or edit
 * the items directly.
 */
export const Default: Story = {
  tags: ['showcase'],
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
  args: {
    items: [deliveryFaq[0], { ...deliveryFaq[1], disabled: true }, deliveryFaq[2]],
  },
}

/** `openMultiple` lets several panels stay open at once. */
export const OpenMultiple: Story = {
  tags: ['api-ref'],
  args: {
    openMultiple: true,
    defaultValue: ['delivery-time', 'delivery-area'],
  },
}

/** `defaultValue` seeds the open items without making the accordion controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
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
  render: (args) => <ControlledAccordion {...args} />,
}

/** `className` merges onto the root, composing with the theme rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { className: 'accordion-demo-wide' },
  render: (args) => (
    <>
      {/* The theme caps `.AccordionRoot` at 20rem; this widens it to show the
          custom class landing alongside the theme's own, not instead of it. */}
      <style>{`.accordion-demo-wide { max-width: 32rem; }`}</style>
      <Accordion {...args} />
    </>
  ),
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

/**
 * DropBoard's store settings panel for Burger Kingdom — shop front, menu
 * pricing, availability, recent orders, and payouts, each an independently
 * collapsible section. Built from Mealdrop's own restaurant record
 * (`src/stub/restaurants.ts` on `agentic-reference/droppy`) and its menu
 * prices, recomposed for the back office, where partners work through several
 * sections at once rather than browsing — hence `openMultiple`.
 */
export const DropBoardStoreSettings: Story = {
  tags: ['examples'],
  args: {
    openMultiple: true,
    defaultValue: ['shop-front', 'availability'],
    items: [
      {
        value: 'shop-front',
        title: 'Shop front',
        content: (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <Body size="XS">
              <strong>Burger Kingdom</strong>
            </Body>
            <Body size="XS">Staalstraat 12, 1011 JL Amsterdam</Body>
            <Body size="XS">Nicest place for burgers</Body>
          </div>
        ),
      },
      {
        value: 'pricing',
        title: 'Menu & pricing',
        content: (
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            {[
              ['Cheeseburger', '€8.50'],
              ['Fries', '€2.50'],
              ['Vanilla ice cream', '€2.00'],
              ['Coca-Cola', '€1.75'],
            ].map(([item, price]) => (
              <Body key={item} size="XS">
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item}</span>
                  <span>{price}</span>
                </span>
              </Body>
            ))}
          </div>
        ),
      },
      {
        value: 'availability',
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Availability
            <Badge text="open" variant="positive" />
          </span>
        ),
        content: <Body size="XS">Accepting orders until 22:00. Kitchen closes 21:30.</Body>,
      },
      {
        value: 'orders',
        title: 'Recent orders',
        content: <Body size="XS">18 orders today, €214.60 in sales.</Body>,
      },
      {
        value: 'payouts',
        title: 'Payouts',
        content: <Body size="XS">Next payout €1,482.30, Friday 6 June.</Body>,
      },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestSingleOpen: Story = {
  tags: ['tests'],
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

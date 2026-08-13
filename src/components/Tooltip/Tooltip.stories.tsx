import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import isChromatic from 'chromatic/isChromatic'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import type { TooltipProps } from './Tooltip'
import { Tooltip } from './Tooltip'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TooltipProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

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

/**
 * A hint for an icon-only control. Label and offset are set below, so the
 * controls start populated — hover or focus the button to see the tip.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'turn on dark mode', sideOffset: 8 },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` is the tip's content — it repeats the name, never replaces it. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'add to your order' },
}

/** `children` becomes the trigger itself rather than being wrapped in one. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: {
    label: 'remove from cart',
    children: <Button round clear icon="cross" aria-label="remove from cart" />,
  },
}

/** `sideOffset` is the gap between trigger and tip. */
export const SideOffset: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { sideOffset: 24 },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { className: 'tooltip-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.tooltip-demo-inset { margin: 1rem; }`}</style>
      <Tooltip {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The tip repeats the trigger's accessible name rather than supplying it. A
 * tooltip is a supplement — it never appears for touch or for a screen reader
 * that doesn't hover, so anything only said here is said to nobody. Give the
 * trigger its own `aria-label` as well, as the demo does.
 */
export const NeverTheOnlyLabel: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The tip fades and scales in off `[data-starting-style]` and
 * `[data-ending-style]`, staying mounted through the exit so the close runs
 * before it leaves the DOM.
 */
export const OpenCloseTransition: Story = {
  tags: ['animation'],
  argTypes: hide('className'),
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.tab()
    const popup = await waitFor(() => {
      const node = canvasElement.ownerDocument.querySelector('.droppy-Tooltip')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Two parts. Only the trigger is reachable by the Anatomy panel: the popup is
 * portalled to the document body, outside the story canvas the panel scans,
 * and `Tooltip` exposes no `container` prop the way `Modal` and `Sidebar` do.
 * The popup's `data-part` is still on the element for anyone inspecting the
 * DOM.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'sideOffset', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'trigger',
          name: 'Trigger',
          description: 'The child element itself — `Tooltip` does not wrap it in anything.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the
 * app's icon-only controls rely on `aria-label` alone, which is correct but
 * leaves sighted mouse users guessing. The story to write is a DropBoard one:
 * the order row's action cluster — print, refund, and contact-courier icon
 * buttons, each with a tip repeating its `aria-label` — wrapped in
 * `TooltipProvider` so moving along the row doesn't replay the opening delay
 * on every button.
 */
export const DropBoardOrderActions: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestShowsOnHover: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    // Chromatic's capture sends synthetic pointer events, which the hover
    // logic ignores — the vitest run drives a real browser and covers this.
    if (isChromatic()) return

    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.hover(canvas.getByRole('button', { name: 'turn on dark mode' }))

    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

export const TestShowsOnFocus: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.tab()

    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

export const TestTriggerKeepsItsOwnName: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // The trigger is the child itself, not a wrapper, and it carries its own
    // accessible name whether or not the tip is showing.
    const trigger = canvas.getByRole('button', { name: 'turn on dark mode' })

    await expect(trigger).toHaveAttribute('data-part', 'trigger')
  },
}

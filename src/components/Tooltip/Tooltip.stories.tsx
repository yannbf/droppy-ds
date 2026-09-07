import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import isChromatic from 'chromatic/isChromatic'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../Button'

import { IconButton } from '../IconButton'

import type { TooltipProps } from './Tooltip'
import { Tooltip, TooltipProvider } from './Tooltip'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TooltipProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
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

export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'turn on dark mode', sideOffset: 8 },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'add to your order' },
}

export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: {
    label: 'remove from cart',
    children: <Button round clear icon="cross" aria-label="remove from cart" />,
  },
}

export const SideOffset: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { sideOffset: 24 },
}

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

export const NeverTheOnlyLabel: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

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

export const MealdropHeaderTips: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'children', 'sideOffset', 'className'),
  render: () => (
    <TooltipProvider>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Tooltip label="Your order">
          <IconButton name="cart" aria-label="Your order" />
        </Tooltip>
        <Tooltip label="Turn on dark mode">
          <IconButton name="moon" aria-label="Turn on dark mode" />
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    // Focus rather than hover: a hovered tip waits out the provider's opening
    // delay, which a synthetic pointer event does not reliably clear on CI,
    // while focus opens it immediately. Tab lands on the first trigger.
    await userEvent.tab()

    // Matched by class rather than by text and tag: the trigger's accessible
    // name repeats the tip's text, and the popup's markup is Base UI's to
    // change.
    await waitFor(() => {
      const popup = canvasElement.ownerDocument.querySelector('.droppy-Tooltip')

      expect(popup).not.toBeNull()
      expect(popup).toHaveTextContent('Your order')
    })
  },
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

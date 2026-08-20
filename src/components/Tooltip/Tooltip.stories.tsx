import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

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

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

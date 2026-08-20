import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'

import type { TooltipProps } from './Tooltip'
import { Tooltip } from './Tooltip'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TooltipProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

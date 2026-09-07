import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { SeparatorProps } from './Separator'
import { Separator } from './Separator'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SeparatorProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Layout & structure/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Sets `aria-orientation` and `data-orientation` together.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Separator` class.',
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `orientation` drives the ARIA attribute and the data attribute together. */
export const Orientation: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span>Above</span>
        <Separator {...args} orientation="horizontal" />
        <span>Below</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '2rem' }}>
        <span>Left</span>
        <Separator {...args} orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation'),
  args: {
    className: 'separator-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.separator-demo-inset { margin: 1rem; }`}</style>
      <Separator {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` with `role="separator"` and no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('orientation', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <span>Above</span>
      <Separator {...args} />
      <span>Below</span>
    </div>
  ),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `role="separator"` line, carrying `aria-orientation` and `data-orientation`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

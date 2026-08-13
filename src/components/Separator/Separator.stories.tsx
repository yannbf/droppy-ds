import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { SeparatorProps } from './Separator'
import { Separator } from './Separator'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SeparatorProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/**
 * A divider between two stacked blocks. `orientation` is set below, so the
 * controls start populated — flip it to vertical and the demo lays out
 * horizontally to match.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { orientation: 'horizontal' },
  argTypes: hide('className'),
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: args.orientation === 'vertical' ? 'row' : 'column',
        alignItems: args.orientation === 'vertical' ? 'center' : undefined,
        gap: '1rem',
        height: args.orientation === 'vertical' ? '2rem' : undefined,
      }}
    >
      <span>Section one</span>
      <Separator {...args} />
      <span>Section two</span>
    </div>
  ),
}

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

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation'),
  args: { className: 'separator-demo-thick' },
  render: (args) => (
    <>
      <style>{`.separator-demo-thick { background: var(--ds-color-border-strong); height: 2px; }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <span>Above</span>
        <Separator {...args} />
        <span>Below</span>
      </div>
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` with `role="separator"` and no children. */
export const Anatomy: Story = {
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * draws its dividers with borders on `OrderSummary`'s rows. The story to write
 * is that summary rebuilt honestly: the cart's line items separated by
 * horizontal separators, with the total below a final one, which is where the
 * semantic role actually earns something a CSS border can't give. The brand
 * rule to respect is BR-02 / DS-01 — separators are `border.subtle` lines, and
 * an accent colour never draws one.
 */
export const MealdropOrderSummaryDividers: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestHorizontalAttributes: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const TestVerticalAttributes: Story = {
  tags: ['tests'],
  args: { orientation: 'vertical' },
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  },
}

export const TestIsNotFocusable: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Structural, not the interactive "range" variant the ARIA spec also
    // permits — so it carries no tabIndex.
    await expect(canvas.getByRole('separator')).not.toHaveAttribute('tabindex')
  },
}

import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

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

const summaryLines = [
  { name: 'Cheeseburger ×2', amount: '€17.00' },
  { name: 'Fries ×1', amount: '€2.50' },
  { name: 'Coca-Cola ×3', amount: '€5.25' },
]

/** Dividers in Mealdrop's order summary. */
export const MealdropOrderSummaryDividers: Story = {
  tags: ['examples'],
  argTypes: hide('orientation', 'style', 'className'),
  render: () => (
    <Card padded style={{ maxWidth: '24rem' }}>
      <Heading level={3} size={4}>
        Order summary
      </Heading>

      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {summaryLines.map((line, index) => (
          <div key={line.name} style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Body size="S">{line.name}</Body>
              <Body size="S">{line.amount}</Body>
            </div>
            {index < summaryLines.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <Separator />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Body fontWeight="bold">Total</Body>
        <Body fontWeight="bold">€24.75</Body>
      </div>
    </Card>
  ),
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

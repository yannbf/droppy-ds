import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

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

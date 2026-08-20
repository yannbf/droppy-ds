import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { ReviewProps } from './Review'
import { Review } from './Review'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/Review',
  component: Review,
  args: { rating: 4.5 },
  argTypes: {
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Average out of 5. Unset or falsy renders “No reviews yet”.',
    },
    color: {
      control: 'text',
      description: 'Overrides the quiet review text token (`--ds-color-text-review`).',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Review` class.',
    },
  },
} satisfies Meta<typeof Review>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: { rating: 4.5 },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Rating: Story = {
  tags: ['api-ref'],
  argTypes: hide('rating', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.25rem' }}>
      {[1, 3, 4.5, 5].map((rating) => (
        <Review {...args} key={rating} rating={rating} />
      ))}
      <Review {...args} rating={undefined} />
    </div>
  ),
}

export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { rating: 4.2, color: '#0a7d32' },
}

export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('color'),
  args: {
    className: 'review-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.review-demo-inset { margin: 1rem; }`}</style>
      <Review {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

export const RatingBands: Story = {
  tags: ['highlight'],
  argTypes: hide('rating', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.25rem' }}>
      {[1, 1.9, 2, 3.9, 4, 4.9, 5].map((rating) => (
        <Review {...args} key={rating} rating={rating} />
      ))}
    </div>
  ),
}

export const NoReviews: Story = {
  tags: ['highlight'],
  argTypes: hide('color', 'className'),
  args: { rating: undefined },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('rating', 'color', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The wrapper the caller positions.' },
        {
          id: 'text',
          name: 'Text',
          description: 'The score line — star, number, and band label as one string.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

export const MealdropRestaurantScores: Story = {
  tags: ['examples'],
  argTypes: hide('rating', 'color', 'className'),
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <Card padded style={{ width: '16rem' }}>
        <Heading level={2} size={4}>
          Burger Kingdom
        </Heading>
        <Review rating={4.2} />
        <Body size="S">Nicest place for burgers</Body>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </Card>

      <Card padded style={{ width: '16rem' }}>
        <Heading level={2} size={4}>
          &apos;t Kuyltje
        </Heading>
        <Review color="var(--ds-color-text-primary)" />
        <Body size="S">Pastrami sandwiches</Body>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <Badge text="new" variant="positive" />
          <Badge text="comfort food" />
        </div>
      </Card>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestFormatsTheScoreLine: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 4.5 Very good')).toBeInTheDocument()
  },
}

export const TestBandBoundaries: Story = {
  tags: ['tests'],
  render: () => (
    <>
      <Review rating={1.9} />
      <Review rating={2} />
      <Review rating={3.9} />
      <Review rating={4} />
      <Review rating={5} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 1.9 Very poor')).toBeInTheDocument()
    await expect(canvas.getByText('★ 2.0 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 3.9 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 4.0 Very good')).toBeInTheDocument()
    await expect(canvas.getByText('★ 5.0 Excellent')).toBeInTheDocument()
  },
}

export const TestNoReviewsFallback: Story = {
  tags: ['tests'],
  args: { rating: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No reviews yet')).toBeInTheDocument()
  },
}

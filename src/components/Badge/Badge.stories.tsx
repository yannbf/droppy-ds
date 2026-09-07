import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'
import { Review } from '../Review'

import type { BadgeProps } from './Badge'
import { Badge } from './Badge'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BadgeProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/Badge',
  component: Badge,
  args: { text: 'vegan' },
  argTypes: {
    text: {
      control: 'text',
      description: 'The label. Rendered capitalized regardless of the casing passed in.',
    },
    variant: {
      control: 'radio',
      options: ['neutral', 'positive'],
      description: '`positive` matches the look of an affirmative flag, e.g. "new".',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Badge` class.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: { text: 'vegan', variant: 'neutral' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Text: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant', 'className'),
  args: { text: 'gluten free' },
}

export const Variant: Story = {
  tags: ['api-ref'],
  argTypes: hide('text', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge {...args} text="vegan" variant="neutral" />
      <Badge {...args} text="new" variant="positive" />
    </div>
  ),
}

export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant'),
  args: {
    className: 'badge-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.badge-demo-inset { margin: 1rem; }`}</style>
      <Badge {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

export const LongerText: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { text: 'contains nuts and dairy' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('text', 'variant', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<span>` carrying the pill background, radius, and capitalization.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

// Mealdrop's own listings (`src/stub/restaurants.ts`) — one rated, one newly listed.
const listings = [
  {
    name: 'Burger Kingdom',
    specialty: 'Nicest place for burgers',
    rating: 4.2 as number | undefined,
    categories: ['burgers', 'comfort food'],
    isNew: false,
    photoUrl:
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
  },
  {
    name: "'t Kuyltje",
    specialty: 'Pastrami sandwiches',
    rating: undefined as number | undefined,
    categories: ['comfort food'],
    isNew: true,
    photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
  },
]

export const MealdropRestaurantTags: Story = {
  tags: ['examples'],
  argTypes: hide('text', 'variant', 'className'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
      {listings.map((listing) => (
        <Card key={listing.name} interactive style={{ width: '18rem' }}>
          <div style={{ position: 'relative', display: 'flex' }}>
            {listing.isNew && (
              <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 1 }}>
                <Badge text="new" variant="positive" />
              </span>
            )}
            <img
              src={listing.photoUrl}
              alt=""
              style={{ height: 160, width: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem', padding: '1.5rem' }}>
            <Heading level={2} size={4}>
              {listing.name}
            </Heading>
            <Review rating={listing.rating} />
            <Body size="S">{listing.specialty}</Body>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {listing.categories.map((category) => (
                <Badge key={category} text={category} />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestCapitalizesText: Story = {
  tags: ['tests'],
  args: { text: 'vegan' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('vegan')).textTransform).toBe('capitalize')
  },
}

export const TestVariantSwapsTokens: Story = {
  tags: ['tests'],
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge text="vegan" />
      <Badge text="new" variant="positive" />
    </div>
  ),
  play: async ({ canvas }) => {
    const neutral = canvas.getByText('vegan')
    const positive = canvas.getByText('new')

    await expect(getComputedStyle(neutral).backgroundColor).not.toBe(
      getComputedStyle(positive).backgroundColor
    )
    await expect(getComputedStyle(neutral).fontWeight).not.toBe(
      getComputedStyle(positive).fontWeight
    )
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { className: 'badge-demo-custom' },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('vegan')

    await expect(badge).toHaveClass('droppy-Badge')
    await expect(badge).toHaveClass('badge-demo-custom')
  },
}

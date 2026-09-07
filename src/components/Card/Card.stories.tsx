import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { Heading } from '../Heading'
import { Review } from '../Review'

import type { CardProps } from './Card'
import { Card } from './Card'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
  argTypes: {
    children: { control: 'text', description: 'Whatever the card groups — no slots.' },
    interactive: {
      control: 'boolean',
      description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
    },
    padded: {
      control: 'boolean',
      description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` providing the surface, with children in normal flow. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  args: { padded: true },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The surface: background, radius, and the clipping that keeps images in.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A restaurant listing tile: photo, name, rating, specialty, categories. */
export const MealdropRestaurantTile: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  render: () => (
    <Card interactive style={{ width: '18rem' }} onClick={() => {}}>
      <img
        src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
        alt=""
        style={{ display: 'block', height: 160, width: '100%', objectFit: 'cover' }}
      />
      <div style={{ display: 'grid', gap: '0.5rem', padding: '1.5rem' }}>
        <Heading level={2} size={4}>
          Burger Kingdom
        </Heading>
        <Review rating={4.2} />
        <Body size="S">Nicest place for burgers</Body>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </div>
    </Card>
  ),
}

/** A category tile: round photo and a single label, on the same shell. */
export const MealdropCategoryTile: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {[
        {
          title: 'Burgers',
          photoUrl:
            'https://images.pexels.com/photos/2233351/pexels-photo-2233351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
        },
        {
          title: 'Pizza',
          photoUrl:
            'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
        },
        {
          title: 'Sushi',
          photoUrl:
            'https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg?auto=compress&cs=tinysrgb&dpr=2&h=550',
        },
      ].map((category) => (
        <Card
          key={category.title}
          interactive
          padded
          style={{ width: '11rem', textAlign: 'center' }}
          onClick={() => {}}
        >
          <img
            src={category.photoUrl}
            alt=""
            style={{
              display: 'block',
              width: '6rem',
              height: '6rem',
              margin: '0 auto 0.75rem',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Body fontWeight="bold">{category.title}</Body>
        </Card>
      ))}
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

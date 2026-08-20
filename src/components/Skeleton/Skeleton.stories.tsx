import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'
import { Review } from '../Review'

import type { SkeletonProps } from './Skeleton'
import { Skeleton } from './Skeleton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SkeletonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Feedback & status/Skeleton',
  component: Skeleton,
  argTypes: {
    width: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `100%`.',
    },
    height: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `1em`.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Skeleton` class.',
    },
    style: { control: false, description: 'Merged after the computed width and height.' },
  },
} satisfies Meta<typeof Skeleton>

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

/** A single part: one `aria-hidden` `<span>` with no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('width', 'height', 'className', 'style'),
  args: { width: 200, height: 24 },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<span>` carrying the computed size and the shimmer gradient.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A restaurant tile loading, beside the tile it becomes. */
export const MealdropRestaurantCardLoading: Story = {
  tags: ['examples'],
  argTypes: hide('width', 'height', 'className', 'style'),
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div role="status" aria-label="Loading restaurants">
        <Card aria-hidden style={{ width: '18rem' }}>
          <Skeleton height={160} />
          <div style={{ display: 'grid', gap: '0.5rem', padding: '1.5rem' }}>
            <Heading level={2} size={4}>
              <Skeleton width="60%" />
            </Heading>
            <Body size="S">
              <Skeleton width="45%" />
            </Body>
            <Body size="S">
              <Skeleton width="80%" />
            </Body>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Skeleton width={72} height={24} />
              <Skeleton width={104} height={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card style={{ width: '18rem' }}>
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
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

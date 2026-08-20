import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

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

/**
 * A placeholder line inside a paragraph, taking the height of the surrounding
 * font. Both dimensions are set below, so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { width: '100%', height: '1em' },
  argTypes: hide('className', 'style'),
  render: (args) => (
    <p style={{ margin: 0, fontSize: '1.5rem' }}>
      <Skeleton {...args} />
    </p>
  ),
}

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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

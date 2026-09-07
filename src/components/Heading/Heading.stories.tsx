import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Card } from '../Card'

import type { HeadingProps } from './Heading'
import { Heading } from './Heading'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof HeadingProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Best food in town' },
  argTypes: {
    children: { control: 'text', description: 'The heading text.' },
    level: {
      control: 'radio',
      options: [1, 2, 3, 4, 5],
      description: 'The rendered tag (`h1`–`h5`). Also the size step when `size` is unset.',
    },
    size: {
      control: 'radio',
      options: [undefined, 1, 2, 3, 4, 5],
      description: 'Visual size step, independent of `level`. Defaults to `level`.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Heading` class.',
    },
  },
} satisfies Meta<typeof Heading>

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

/** A single part, whose tag follows `level`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'level', 'size', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The rendered `<h1>`–`<h5>`, picked by `level` and sized by `size`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The heading ladder on a restaurant detail page. */
export const MealdropHeadingLadder: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'level', 'size', 'className'),
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', maxWidth: '36rem' }}>
      <Heading level={1}>Burger Kingdom</Heading>

      {[
        { section: 'Food', dishes: ['Cheeseburger', 'Fries'] },
        { section: 'Dessert', dishes: ['Vanilla ice cream'] },
        { section: 'Drinks', dishes: ['Coca-Cola', 'Sprite'] },
      ].map(({ section, dishes }) => (
        <section key={section} style={{ display: 'grid', gap: '0.75rem' }}>
          <Heading level={2}>{section}</Heading>
          {dishes.map((dish) => (
            <Card key={dish} padded>
              <Heading level={3} size={4}>
                {dish}
              </Heading>
              <Body size="S">Nice grilled burger with cheese</Body>
            </Card>
          ))}
        </section>
      ))}
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

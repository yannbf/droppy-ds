import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Card } from '../Card'

import type { HeadingProps } from './Heading'
import { Heading } from './Heading'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof HeadingProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/**
 * A page title. `level` and `size` are both set below, so the controls start
 * populated — move them apart to see the tag and the visual size decouple.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Best food in town', level: 1, size: undefined },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the heading text; nodes work as well as strings. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'className'),
  args: {
    children: (
      <>
        Best food in <em>town</em>
      </>
    ),
  },
}

/** `level` picks the tag and, on its own, the size step to match. */
export const Levels: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'className'),
  render: (args) => (
    <>
      {([1, 2, 3, 4, 5] as const).map((level) => (
        <Heading {...args} key={level} level={level}>
          Level {level}
        </Heading>
      ))}
    </>
  ),
}

/** `size` picks the visual step on its own; the tag still follows `level`. */
export const Sizes: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'className'),
  render: (args) => (
    <>
      {([1, 2, 3, 4, 5] as const).map((size) => (
        <Heading {...args} key={size} level={2} size={size}>
          h2 at size {size}
        </Heading>
      ))}
    </>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size'),
  args: {
    className: 'heading-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.heading-demo-inset { margin: 1rem; }`}</style>
      <Heading {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * `size` decouples the visual size from the outline, so a card title can stay
 * an `h2` for screen readers while looking like a level-4 heading. Without it
 * you'd reach for a wrong `level` and break the document outline.
 */
export const SizeDecoupledFromLevel: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { level: 2, size: 4 },
}

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
/* ------------------------------------------------------------------ */

export const TestRendersMatchingTag: Story = {
  tags: ['tests'],
  args: { level: 3 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument()
  },
}

export const TestSizeDoesNotChangeTag: Story = {
  tags: ['tests'],
  args: { level: 2, size: 4 },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2 })

    await expect(heading).toHaveClass('droppy-Heading--4')
    await expect(heading).not.toHaveClass('droppy-Heading--2')
  },
}

export const TestForwardsRefAndProps: Story = {
  tags: ['tests'],
  args: { id: 'heading-demo-id', level: 2 },
  play: async ({ canvas }) => {
    // The ref/prop passthrough is what lets Base UI's Dialog.Title and
    // Drawer.Title point `aria-labelledby` at the real heading element.
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'heading-demo-id')
  },
}

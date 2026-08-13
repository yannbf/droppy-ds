import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { HeadingProps } from './Heading'
import { Heading } from './Heading'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof HeadingProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): 15 files import `Heading`
 * — `Logo`, `RestaurantCard`, `OrderSummary`, `CategoryListPage`,
 * `FooterCard`. The story to write: the restaurant detail page's heading
 * ladder — the `h1` restaurant name, `h2` menu-section titles ('Food',
 * 'Dessert', 'Drinks'), and `h3` dish names inside the cards. That is exactly
 * the case `size` was added for: Mealdrop wrapped `Heading` in `styled()` at
 * four call sites to shrink a correctly-levelled heading (docs/MEALDROP-PARITY.md),
 * so the example should show the card title as `level={3} size={4}` instead.
 */
export const MealdropHeadingLadder: Story = {
  tags: ['examples'],
  render: () => TODO,
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

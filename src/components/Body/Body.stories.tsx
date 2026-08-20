import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '../Badge'
import { Heading } from '../Heading'

import type { BodyProps } from './Body'
import { Body } from './Body'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BodyProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Typography/Body',
  component: Body,
  args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
  argTypes: {
    children: { control: 'text', description: 'The text, or any nodes to render inside.' },
    size: {
      control: 'radio',
      options: [undefined, 'S', 'XS', 'XXS'],
      description: 'Visual size step. Absent renders the base body size.',
    },
    fontWeight: {
      control: 'radio',
      options: ['regular', 'medium', 'bold', 'black'],
      description: 'Font weight, independent of `size` and `type`.',
    },
    type: {
      control: 'radio',
      options: ['p', 'span', 'label', 'figcaption'],
      description: 'The rendered element.',
    },
    color: {
      control: 'text',
      description: 'Overrides the text color inline. Unset, follows the primary text token.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Body` class.',
    },
  },
} satisfies Meta<typeof Body>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A line of body copy at the base size. Every prop that shapes the text is set
 * below, so the controls start populated — change the size step, the weight, or
 * the element it renders as.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    children: 'The kitchen closes at 10pm, last orders 9:30.',
    size: undefined,
    fontWeight: 'regular',
    type: 'p',
  },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` takes nodes as well as strings, so inline markup composes. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'color', 'className'),
  args: {
    children: (
      <>
        Delivery is <strong>free</strong> over €20 — <em>today only</em>.
      </>
    ),
  },
}

/** `size` picks the type-scale step, leaving the element and weight alone. */
export const Sizes: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'color', 'className'),
  render: (args) => (
    <>
      <Body {...args}>Base</Body>
      <Body {...args} size="S">
        S
      </Body>
      <Body {...args} size="XS">
        XS
      </Body>
      <Body {...args} size="XXS">
        XXS
      </Body>
    </>
  ),
}

/** `fontWeight` is independent of both size and element. */
export const Weights: Story = {
  tags: ['api-ref'],
  argTypes: hide('fontWeight', 'color', 'className'),
  render: (args) => (
    <>
      <Body {...args} fontWeight="regular">
        Regular
      </Body>
      <Body {...args} fontWeight="medium">
        Medium
      </Body>
      <Body {...args} fontWeight="bold">
        Bold
      </Body>
      <Body {...args} fontWeight="black">
        Black
      </Body>
    </>
  ),
}

/** `type` picks which element is rendered — all four share the same styling. */
export const ElementChoice: Story = {
  tags: ['api-ref'],
  argTypes: hide('type', 'color', 'className'),
  render: (args) => (
    <>
      <Body {...args} type="p">
        p
      </Body>
      <Body {...args} type="span">
        span
      </Body>
      <Body {...args} type="label">
        label
      </Body>
      <Body {...args} type="figcaption">
        figcaption
      </Body>
    </>
  ),
}

/** `color` overrides the text token inline, for the cases the scale doesn't cover. */
export const ColorOverride: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'className'),
  args: { color: 'var(--ds-color-text-error)', children: 'Delivery unavailable at this address.' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'color'),
  args: {
    className: 'body-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.body-demo-inset { margin: 1rem; }`}</style>
      <Body {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * `type` renders a real element, not a styled `span` — `label` gives you a
 * `<label>` that can be associated with a control.
 */
export const RendersMatchingTag: Story = {
  tags: ['highlight'],
  argTypes: hide('size', 'fontWeight', 'color', 'className'),
  args: { type: 'label', children: 'Delivery address' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag follows `type`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('size', 'fontWeight', 'type', 'color', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The rendered element — `<p>`, `<span>`, `<label>`, or `<figcaption>` per `type`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The text column of a restaurant tile. */
export const MealdropRestaurantCardText: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'size', 'fontWeight', 'type', 'color', 'className'),
  render: () => (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '18rem' }}>
      <Heading level={2} size={4}>
        Burger Kingdom
      </Heading>
      <Body size="S">Nicest place for burgers</Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Body size="XS" fontWeight="medium">
          Serves
        </Body>
        <Badge text="burgers" />
        <Badge text="comfort food" />
      </div>
      <Body size="XXS">Delivers in 25–35 min · €2.50 delivery · Staalstraat 12, Amsterdam</Body>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersMatchingTag: Story = {
  tags: ['tests'],
  args: { type: 'label', children: 'Delivery address' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Delivery address').tagName).toBe('LABEL')
  },
}

export const TestSizeAndWeightAreIndependent: Story = {
  tags: ['tests'],
  render: () => (
    <>
      <Body size="XS">Small regular</Body>
      <Body size="XS" fontWeight="bold">
        Small bold
      </Body>
    </>
  ),
  play: async ({ canvas }) => {
    const regular = canvas.getByText('Small regular')
    const bold = canvas.getByText('Small bold')

    await expect(getComputedStyle(regular).fontSize).toBe(getComputedStyle(bold).fontSize)
    await expect(getComputedStyle(regular).fontWeight).not.toBe(getComputedStyle(bold).fontWeight)
  },
}

export const TestColorOverridesToken: Story = {
  tags: ['tests'],
  args: { color: 'rgb(10, 125, 50)', children: 'Delivered' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Delivered')).color).toBe('rgb(10, 125, 50)')
  },
}

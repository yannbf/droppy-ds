import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { iconNames } from './icons'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconProps>) =>
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
  title: 'Media & content/Icon',
  component: Icon,
  args: { name: 'cart' },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    size: { control: 'text', description: 'Rendered width and height. Defaults to `1.5rem`.' },
    color: {
      control: 'text',
      description: 'Overrides the stroke colour. Defaults to the theme’s icon token.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Icon` class.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One glyph from the set. Name and size are set below, so the controls start
 * populated — pick another icon from the dropdown or change the size.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'cart', size: '1.5rem' },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `name` picks from the bundled set — every icon in it, below. */
export const Name: Story = {
  tags: ['api-ref'],
  argTypes: hide('name', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ textAlign: 'center', fontSize: '0.75rem', width: '5rem' }}>
          <Icon {...args} name={name} size="2rem" style={{ margin: '0 auto 0.5rem' }} />
          {name}
        </div>
      ))}
    </div>
  ),
}

/** `size` sets width and height together; numbers and CSS lengths both work. */
export const Size: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {['1rem', '1.5rem', '2rem', '3rem'].map((size) => (
        <Icon {...args} key={size} size={size} />
      ))}
    </div>
  ),
}

/** `color` overrides the stroke, for the cases the icon token doesn't cover. */
export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { color: 'var(--ds-color-text-error)', size: '2rem' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('color'),
  args: {
    className: 'icon-demo-inset',
    size: '2rem',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.icon-demo-inset { margin: 1rem; }`}</style>
      <Icon {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Icons are decorative by default: `aria-hidden` and `focusable="false"`, so
 * they never reach the accessibility tree. The control an icon sits inside is
 * what carries the accessible name — see `IconButton`'s `aria-label`.
 */
export const DecorativeByDefault: Story = {
  tags: ['highlight'],
  argTypes: hide('color', 'className'),
  render: (args) => (
    <button type="button" aria-label="Add to cart" style={{ padding: '0.5rem' }}>
      <Icon {...args} />
    </button>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<svg>`, its paths supplied by `name`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'size', 'color', 'className'),
  args: { size: '3rem' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<svg>` carrying the viewBox, the stroke colour, and the size.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * reaches for `Button`'s and `IconButton`'s `icon` props rather than rendering
 * `Icon` itself, which is the honest recommendation. The story to write should
 * make that point rather than hide it: the header's cart affordance built
 * three ways — `Button icon="cart"`, `IconButton name="cart"`, and a bare
 * `Icon` inside a caller-owned control — showing that reaching for `Icon`
 * directly means owning the accessible name yourself.
 */
export const MealdropCartAffordances: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestIsDecorative: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const TestSizeAppliesToBothAxes: Story = {
  tags: ['tests'],
  args: { size: '2rem' },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    // `minWidth` is what stops a flex parent squeezing the glyph.
    await expect(icon.style.width).toBe('2rem')
    await expect(icon.style.height).toBe('2rem')
    await expect(icon.style.minWidth).toBe('2rem')
  },
}

export const TestColorOverridesStroke: Story = {
  tags: ['tests'],
  args: { color: 'rgb(183, 28, 28)' },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    await expect(getComputedStyle(icon).stroke).toBe('rgb(183, 28, 28)')
  },
}

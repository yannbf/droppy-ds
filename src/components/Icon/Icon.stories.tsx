import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { iconNames } from './icons'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
/* tests — assertions only, one behaviour each                         */

import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Button } from '../Button'
import { Heading } from '../Heading'

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

export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'cart', size: '1.5rem' },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

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

export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { color: 'var(--ds-color-text-error)', size: '2rem' },
}

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

const toCurrency = (amount: number) =>
  amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

export const MealdropHeader: Story = {
  tags: ['examples'],
  argTypes: hide('name', 'color', 'size'),
  parameters: { layout: 'fullscreen' },
  render: () => (
    <>
      {/* Mealdrop's Header is styled-components with a `breakpoints.M` query;
          the same rules are inlined so the story is a port, not a lookalike. */}
      <style>{`
        .mealdrop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 56px;
          padding: 0 1.5rem;
          border-bottom: 1px solid var(--ds-color-border-subtle);
          background: var(--ds-color-surface-page);
        }
        .mealdrop-header-options {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .mealdrop-header-nav { display: none; }
        @media (min-width: 768px) {
          .mealdrop-header { height: 72px; }
          .mealdrop-header-nav { display: contents; }
        }
      `}</style>

      <header className="mealdrop-header">
        <Heading level={2} size={4}>
          Mealdrop
        </Heading>

        <div className="mealdrop-header-options">
          <span className="mealdrop-header-nav">
            <Button round clear icon="sun" aria-label="turn on dark mode" />
            <Button clear>Home</Button>
            <Button clear>All restaurants</Button>
          </span>
          <Button icon="cart" aria-label="food cart">
            {/* Mealdrop colours these spans from the button's own text token;
                `inherit` is the same thing without naming a second token. */}
            <Body type="span" color="inherit">
              Order
            </Body>
            <Body type="span" color="inherit" fontWeight="bold">
              {toCurrency(24.75)}
            </Body>
          </Button>
        </div>
      </header>
    </>
  ),
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

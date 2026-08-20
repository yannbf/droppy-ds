import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Button } from '../Button'
import { Heading } from '../Heading'

import type { IconProps } from './Icon'
import { Icon } from './Icon'
import { iconNames } from './icons'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

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

const toCurrency = (amount: number) =>
  amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

/** Mealdrop's header, where every icon reaches the page through a control's
 *  `icon` prop rather than a bare `Icon`. */
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

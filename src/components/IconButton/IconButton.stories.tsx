import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { iconNames } from '../Icon'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: { name: 'arrow-right', 'aria-label': 'next', onClick: fn() },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    small: { control: 'boolean', description: 'Renders the 3rem variant instead of 4rem.' },
    onClick: { description: 'Fired on click.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-IconButton` class.',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'arrow-right', small: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Name: Story = {
  tags: ['api-ref'],
  argTypes: hide('small', 'className'),
  args: { name: 'cross', 'aria-label': 'close' },
}

export const Small: Story = {
  tags: ['api-ref'],
  argTypes: hide('name', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-left" small aria-label="previous, small" />
    </div>
  ),
}

export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('small'),
  args: {
    className: 'iconbutton-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.iconbutton-demo-inset { margin: 1rem; }`}</style>
      <IconButton {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

export const StaysLightOnAnySurface: Story = {
  tags: ['highlight'],
  argTypes: hide('small', 'className'),
  render: (args) => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #1a1a1a, #4cc8c0)',
        borderRadius: '0.5rem',
      }}
    >
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-right" aria-label="next" />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'small', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The circular `<button>`: fixed size, radius, and focus ring.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The glyph, sized from `small` and coloured independently of the theme.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

const railTiles = [
  {
    name: 'Burger Kingdom',
    photoUrl:
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
  },
  {
    name: 'Kara Fin',
    photoUrl:
      'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    name: 'Ciao Bella',
    photoUrl:
      'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
]

export const MealdropCarouselArrows: Story = {
  tags: ['examples'],
  argTypes: hide('name', 'small', 'onClick'),
  render: () => (
    <div style={{ position: 'relative', maxWidth: '34rem' }}>
      <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
        {railTiles.map((tile) => (
          <Card key={tile.name} interactive style={{ minWidth: '16rem' }}>
            <img
              src={tile.photoUrl}
              alt=""
              style={{ display: 'block', height: 140, width: '100%', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <Heading level={3} size={5}>
                {tile.name}
              </Heading>
              <Body size="XS">Delivers in 25–35 min</Body>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ position: 'absolute', top: '3rem', left: '-1rem' }}>
        <IconButton name="arrow-left" aria-label="Previous restaurants" />
      </div>
      <div style={{ position: 'absolute', top: '3rem', right: '-1rem' }}>
        <IconButton name="arrow-right" aria-label="Next restaurants" />
      </div>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestClickHandling: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'next' }))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const TestNamedByAriaLabel: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Icon-only: the glyph is aria-hidden, so the label is the only name.
    await expect(canvas.getByRole('button', { name: 'next' })).toHaveTextContent('')
  },
}

export const TestSmallShrinksGlyph: Story = {
  tags: ['tests'],
  render: (args) => (
    <>
      <IconButton {...args} aria-label="regular" />
      <IconButton {...args} small aria-label="small" />
    </>
  ),
  play: async ({ canvas }) => {
    const regular = canvas.getByRole('button', { name: 'regular' }).querySelector('svg')
    const small = canvas.getByRole('button', { name: 'small' }).querySelector('svg')

    await expect(regular?.getAttribute('width')).toBe('24')
    await expect(small?.getAttribute('width')).toBe('15')
  },
}

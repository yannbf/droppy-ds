import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The circular control and the glyph it centres. */
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

/** Carousel arrows floating over restaurant photos. */
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

import { LottieSvg } from 'lottie-react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import errorAnimation from './animations/Error.json'
import notFoundAnimation from './animations/NotFound.json'

import type { ErrorBlockProps } from './ErrorBlock'
import { ErrorBlock } from './ErrorBlock'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ErrorBlockProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const sushiIllustration = (
  <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="56" fill="var(--ds-color-surface-sunken)" />
    <circle cx="60" cy="60" r="34" fill="var(--ds-palette-neutral-0)" />
    <circle cx="60" cy="60" r="14" fill="var(--ds-palette-brand-200)" />
  </svg>
)

const meta = {
  title: 'Feedback & status/ErrorBlock',
  component: ErrorBlock,
  args: {
    title: 'This is not the food you’re looking for.',
    body: 'There seems that there are no restaurants in this category yet. Try to come back later?',
    buttonText: 'See all restaurants',
    onButtonClick: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2` at the top of the block.' },
    body: { control: 'text', description: 'The explanation, as body copy.' },
    buttonText: { control: 'text', description: 'Label for the single recovery action.' },
    onButtonClick: { description: 'Fired by that action.' },
    illustration: {
      control: false,
      description:
        'Optional slot — an inline SVG, an image, or an animation the caller drives itself.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ErrorBlock` class.',
    },
  },
} satisfies Meta<typeof ErrorBlock>

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

/** Title, optional illustration, body, and one action — in that DOM order. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('title', 'body', 'buttonText', 'illustration', 'className'),
  args: { illustration: sushiIllustration },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The centred column holding the whole message.' },
        { id: 'title', name: 'Title', description: 'The `h2`, first in the DOM.' },
        {
          id: 'illustration',
          name: 'Illustration',
          description: 'The optional slot; absent, nothing is rendered in its place.',
        },
        { id: 'body', name: 'Body', description: 'The explanation copy.' },
        { id: 'action', name: 'Action', description: 'The single recovery Button.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Mealdrop's own Lottie illustrations, copied from the app — the player and
 *  the JSON are application assets, so they live with these stories rather
 *  than shipping in the package. `chromatic-ignore` keeps the animation out of
 *  visual regression, since a looping frame is never the same twice. */
const AnimatedIllustration = ({ animation }: { animation: object }) => (
  <span className="chromatic-ignore">
    <LottieSvg src={animation} loop autoplay style={{ width: 320, height: 240 }} />
  </span>
)

/** A category with nothing in it. */
export const MealdropEmptyCategory: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'className'),
  render: () => (
    <ErrorBlock
      illustration={<AnimatedIllustration animation={errorAnimation} />}
      title="This is not the food you're looking for."
      body="No restaurants are serving sushi near you right now. Try another category."
      buttonText="Browse categories"
      onButtonClick={() => {}}
    />
  ),
}

/** A restaurant that isn't there. */
export const MealdropNotFound: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'className'),
  render: () => (
    <ErrorBlock
      illustration={<AnimatedIllustration animation={notFoundAnimation} />}
      title="We couldn't find that restaurant."
      body="It may have closed, or the link may be out of date."
      buttonText="Back to home"
      onButtonClick={() => {}}
    />
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { ImageCardProps } from './ImageCard'
import { ImageCard } from './ImageCard'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ImageCardProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const photo = 'https://placehold.co/320x180'
const avatar = 'https://placehold.co/200x200'

const meta = {
  title: 'Media & content/ImageCard',
  component: ImageCard,
  args: { src: photo, alt: 'Grilled cheese sandwich on a wooden board', caption: 'Grilled cheese' },
  argTypes: {
    src: { control: 'text', description: 'Image URL.' },
    alt: {
      control: 'text',
      description:
        'Accessible description. Pass `alt=""` for a purely decorative image — screen readers skip it.',
    },
    caption: { control: 'text', description: 'Rendered as a real `<figcaption>` via `Body`.' },
    captionOverlay: {
      control: 'boolean',
      description:
        'Floats the caption over the top-left corner instead of below it. Has no effect when `round` is set.',
    },
    round: {
      control: 'boolean',
      description: 'Circular image with the caption below. Takes precedence over `captionOverlay`.',
    },
    shell: {
      control: 'boolean',
      description:
        "Adds Card's surface classes (background, radius, clipping, padding) to the root.",
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ImageCard` class.',
    },
  },
  decorators: [
    // Single-tile stories read best at a tile-ish width; compositions widen
    // the frame per story through the `frameWidth` parameter.
    (Story, { parameters }) => (
      <div style={{ width: parameters.frameWidth ?? '16rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A figure with an image and a caption below it — the default reading, matching
 * MealDrop's squared category tile before its caption grows a floating chip.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { src: photo, alt: 'Grilled cheese sandwich on a wooden board', caption: 'Grilled cheese' },
  argTypes: hide('captionOverlay', 'round', 'shell', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `src`/`alt` are the only required props — everything else is a variant on top of them. */
export const SrcAndAlt: Story = {
  tags: ['api-ref'],
  argTypes: hide('caption', 'captionOverlay', 'round', 'shell', 'className'),
  args: { caption: undefined },
}

/** `caption` is optional — omitted, no `<figcaption>` renders at all. */
export const Caption: Story = {
  tags: ['api-ref'],
  argTypes: hide('captionOverlay', 'round', 'shell', 'className'),
  args: { caption: undefined },
}

/** `captionOverlay` floats the caption as a chip over the image's top-left corner —
 *  MealDrop's squared tile look. */
export const CaptionOverlay: Story = {
  tags: ['api-ref'],
  argTypes: hide('round', 'shell', 'className'),
  args: { captionOverlay: true, caption: 'Asian' },
}

/** `round` clips the image to a circle and keeps the caption below it, centered —
 *  MealDrop's avatar tile look. */
export const Round: Story = {
  tags: ['api-ref'],
  argTypes: hide('captionOverlay', 'shell', 'className'),
  args: { src: avatar, round: true, caption: 'Asian' },
}

/** `shell` adds Card's own surface classes to the root — background, radius,
 *  clipping, and padding — without duplicating any of Card's CSS. */
export const Shell: Story = {
  tags: ['api-ref'],
  argTypes: hide('captionOverlay', 'round', 'className'),
  args: { shell: true, caption: 'Grilled cheese' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('captionOverlay', 'round', 'shell'),
  args: { className: 'image-card-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.image-card-demo-inset { margin: 1rem; }`}</style>
      <ImageCard {...args} />
    </>
  ),
}

/** `alt=""` marks a purely decorative image — assistive tech skips it entirely. */
export const DecorativeAlt: Story = {
  tags: ['api-ref'],
  argTypes: hide('captionOverlay', 'round', 'shell', 'className'),
  args: { alt: '', caption: 'Decorative — the caption alone carries the meaning' },
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** `round` wins over `captionOverlay` — a floating chip has no circular-safe
 *  corner to sit in, so the caption always renders below a round image. */
export const RoundIgnoresCaptionOverlay: Story = {
  tags: ['highlight'],
  argTypes: hide('shell', 'className'),
  args: { src: avatar, round: true, captionOverlay: true, caption: 'Asian' },
}

/** `round` and `shell` together reproduce MealDrop's avatar tile: a circular
 *  image, its caption below, inside a padded Card surface. */
export const RoundAvatarInCard: Story = {
  tags: ['highlight'],
  argTypes: hide('captionOverlay', 'className'),
  args: { src: avatar, round: true, shell: true, caption: 'Asian' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Three parts: the `<figure>` root, the `<img>`, and the `<figcaption>`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('captionOverlay', 'round', 'shell', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The `<figure>` — margin reset, optional shell.' },
        { id: 'image', name: 'Image', description: 'The `<img>`, sized by the root.' },
        {
          id: 'caption',
          name: 'Caption',
          description: 'The `<figcaption>`, rendered via `Body`, when `caption` is set.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * Mealdrop's restaurant-category row, rebuilt on ImageCard: the squared photo
 * tiles carry their name as a floating chip over the image, and the round
 * cuisine avatar is a circular image on a Card with the caption beneath. Both
 * were hand-rolled `figure` compositions in the app; each is one prop
 * combination here.
 */
export const MealdropCategoryTile: Story = {
  tags: ['examples'],
  parameters: { frameWidth: 'max-content' },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-md)', alignItems: 'flex-start' }}>
      <ImageCard
        src="https://placehold.co/320x180"
        alt=""
        caption="Burgers"
        captionOverlay
        style={{ width: '20rem' }}
      />
      <ImageCard
        src="https://placehold.co/320x180"
        alt=""
        caption="Pizza"
        captionOverlay
        style={{ width: '20rem' }}
      />
      <ImageCard
        src="https://placehold.co/200x200"
        alt=""
        caption="Asian"
        round
        shell
        style={{ width: '13rem' }}
      />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersFigureAndFigcaption: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-ImageCard')

    await expect(root?.tagName).toBe('FIGURE')
    await expect(root?.querySelector('figcaption')).not.toBeNull()
    await expect(getComputedStyle(root as Element).margin).toBe('0px')
  },
}

export const TestCaptionOmittedRendersNoFigcaption: Story = {
  tags: ['tests'],
  args: { caption: undefined },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-ImageCard')

    await expect(root?.querySelector('figcaption')).toBeNull()
  },
}

export const TestDecorativeAltIsEmptyNotOmitted: Story = {
  tags: ['tests'],
  args: { alt: '' },
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector('.droppy-ImageCard-image')

    await expect(img).toHaveAttribute('alt', '')
  },
}

export const TestRoundIgnoresCaptionOverlayAssertion: Story = {
  tags: ['tests'],
  args: { src: avatar, round: true, captionOverlay: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-ImageCard')

    await expect(root).toHaveClass('droppy-ImageCard--round')
    await expect(root?.querySelector('.droppy-ImageCard-caption--overlay')).toBeNull()
  },
}

export const TestShellReusesCardClasses: Story = {
  tags: ['tests'],
  args: { shell: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-ImageCard')

    await expect(root).toHaveClass('droppy-Card')
    await expect(root).toHaveClass('droppy-Card--padded')
  },
}

export const TestClassNameMerges: Story = {
  tags: ['tests'],
  args: { className: 'consumer-class' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-ImageCard')

    await expect(root).toHaveClass('droppy-ImageCard')
    await expect(root).toHaveClass('consumer-class')
  },
}

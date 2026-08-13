import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { TopBannerProps } from './TopBanner'
import { TopBanner } from './TopBanner'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TopBannerProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

// A tiny inline gradient standing in for a restaurant photo, so the story has
// no network dependency.
const photoDataUri = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#4cc8c0"/><stop offset="1" stop-color="#22aca7"/>' +
    '</linearGradient></defs>' +
    '<rect width="800" height="240" fill="url(#g)"/></svg>'
)}`

const meta = {
  title: 'Media & content/TopBanner',
  component: TopBanner,
  args: { title: 'Categories' },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2`. Omitted, the banner is bare.' },
    photoUrl: {
      control: 'text',
      description: 'Background image. Present, the heading switches to its on-photo treatment.',
    },
    onBackClick: {
      control: false,
      description:
        'Accepted for call-site parity with Mealdrop’s `TopBanner`. No control is rendered, so it is never invoked.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-TopBanner` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopBanner>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The page header band. Title and photo are both set below, so the controls
 * start populated — clear the photo to see the plain treatment.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { title: 'Categories', photoUrl: photoDataUri },
  argTypes: hide('onBackClick', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `title` renders as an `h2` inside the band. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('photoUrl', 'onBackClick', 'className'),
  args: { title: 'Sushi places near you', photoUrl: undefined },
}

/** `photoUrl` sets the background and switches the heading to its on-photo treatment. */
export const PhotoUrl: Story = {
  tags: ['api-ref'],
  argTypes: hide('onBackClick', 'className'),
  args: { photoUrl: photoDataUri },
}

/**
 * `onBackClick` is accepted for call-site parity with Mealdrop's own
 * `TopBanner`, whose back button is commented out in its source. Nothing here
 * renders a control, so the callback never fires.
 */
export const OnBackClick: Story = {
  tags: ['api-ref'],
  argTypes: hide('photoUrl', 'className'),
  args: { onBackClick: () => {}, photoUrl: undefined },
}

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('onBackClick'),
  args: { className: 'topbanner-demo-tall' },
  render: (args) => (
    <>
      <style>{`.topbanner-demo-tall { min-height: 14rem; }`}</style>
      <TopBanner {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * With a photo behind it the heading takes its on-photo treatment, so the text
 * holds contrast against arbitrary imagery rather than trusting the surface
 * token underneath.
 */
export const HeadingOverPhoto: Story = {
  tags: ['highlight'],
  argTypes: hide('onBackClick', 'className'),
  render: (args) => (
    <>
      <TopBanner {...args} title="Without a photo" photoUrl={undefined} />
      <TopBanner {...args} title="Over a photo" photoUrl={photoDataUri} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The band and its optional heading. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('title', 'photoUrl', 'onBackClick', 'className'),
  args: { photoUrl: photoDataUri },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The band, carrying the background image when `photoUrl` is set.',
        },
        {
          id: 'title',
          name: 'Title',
          description: 'The `h2`, switched to its on-photo treatment when there is a photo.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): four importers, the
 * category and restaurant detail pages among them. The story to write: the
 * restaurant detail header — the banner carrying `restaurant.photoUrl` with
 * 'Burger Kingdom' over it, then `Review` and the category `Badge`s below the
 * band — which is the composition that shows why the heading needs its
 * on-photo treatment, since the photo behind it is uncontrolled.
 */
export const MealdropRestaurantHeader: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersTitleAsHeading: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Categories' })).toBeInTheDocument()
  },
}

export const TestPhotoBecomesBackground: Story = {
  tags: ['tests'],
  args: { photoUrl: photoDataUri },
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('heading', { level: 2 }).parentElement as HTMLElement

    await expect(getComputedStyle(banner).backgroundImage).toContain('url(')
  },
}

export const TestTitleIsOptional: Story = {
  tags: ['tests'],
  args: { title: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
  },
}

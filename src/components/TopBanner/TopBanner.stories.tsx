import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { TopBannerProps } from './TopBanner'
import { TopBanner } from './TopBanner'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TopBannerProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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
    title: {
      control: 'text',
      description: 'Rendered as a heading at `level`. Omitted, the banner is bare.',
    },
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5],
      description:
        'Heading level of the title. Defaults to 1, for the common case where the banner carries the page’s primary title.',
    },
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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `title` renders as a heading at `level` inside the band. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'photoUrl', 'onBackClick', 'className'),
  args: { title: 'Sushi places near you', photoUrl: undefined },
}

/**
 * `level` sets the heading level without changing the visual treatment's role:
 * the default `h1` fits a page whose primary title the banner carries; pass a
 * deeper level when the page's `h1` lives elsewhere.
 */
export const Level: Story = {
  tags: ['api-ref'],
  argTypes: hide('photoUrl', 'onBackClick', 'className'),
  args: { title: 'Categories', level: 2, photoUrl: undefined },
}

/** `photoUrl` sets the background and switches the heading to its on-photo treatment. */
export const PhotoUrl: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'onBackClick', 'className'),
  args: { photoUrl: photoDataUri },
}

/**
 * `onBackClick` is accepted for call-site parity with Mealdrop's own
 * `TopBanner`, whose back button is commented out in its source. Nothing here
 * renders a control, so the callback never fires.
 */
export const OnBackClick: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'photoUrl', 'className'),
  args: { onBackClick: () => {}, photoUrl: undefined },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'onBackClick'),
  args: {
    className: 'topbanner-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.topbanner-demo-inset { margin: 1rem; }`}</style>
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
  argTypes: hide('level', 'onBackClick', 'className'),
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
  tags: ['anatomy'],
  argTypes: hide('title', 'level', 'photoUrl', 'onBackClick', 'className'),
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
          description:
            'The heading (`h1` by default), switched to its on-photo treatment when there is a photo.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

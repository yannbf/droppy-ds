import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '../Badge'
import { Review } from '../Review'

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

export const Default: Story = {
  tags: ['showcase'],
  args: { title: 'Categories', photoUrl: photoDataUri },
  argTypes: hide('onBackClick', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('photoUrl', 'onBackClick', 'className'),
  args: { title: 'Sushi places near you', photoUrl: undefined },
}

export const PhotoUrl: Story = {
  tags: ['api-ref'],
  argTypes: hide('onBackClick', 'className'),
  args: { photoUrl: photoDataUri },
}

export const OnBackClick: Story = {
  tags: ['api-ref'],
  argTypes: hide('photoUrl', 'className'),
  args: { onBackClick: () => {}, photoUrl: undefined },
}

export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('onBackClick'),
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

export const Anatomy: Story = {
  tags: ['anatomy'],
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

export const MealdropRestaurantHeader: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'photoUrl', 'onBackClick', 'className'),
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div>
      <TopBanner
        title="Burger Kingdom"
        photoUrl="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
      />
      <div style={{ display: 'grid', gap: '0.75rem', padding: '1.5rem' }}>
        <Review rating={4.2} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </div>
    </div>
  ),
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

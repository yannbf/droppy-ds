import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { ScrollAreaProps } from './ScrollArea'
import { ScrollArea } from './ScrollArea'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ScrollAreaProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const paragraphs = [
  `Vernacular architecture is building done outside any academic tradition, and without
  professional guidance. It is not a particular architectural movement or style, but rather a
  broad category encompassing a wide range of building types, with differing methods of
  construction, from around the world, both historical and modern.`,
  `This type of architecture usually serves immediate, local needs, is constrained by the
  materials available in its particular region and reflects local traditions and cultural
  practices. More recently it has been examined by designers and the building industry in an
  effort to be more energy conscious with contemporary design and construction.`,
  `Vernacular architecture constitutes the majority of the world's built environment, as
  measured against the small percentage of new buildings every year designed by architects
  and built by engineers.`,
]

const wideGrid = (
  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 4rem)', margin: 0, padding: 0 }}>
    {Array.from({ length: 100 }, (_, index) => (
      <li key={index} style={{ listStyle: 'none', padding: '0.5rem' }}>
        {index + 1}
      </li>
    ))}
  </ul>
)

const meta = {
  title: 'Layout & structure/ScrollArea',
  component: ScrollArea,
  args: { children: paragraphs.map((text, index) => <p key={index}>{text}</p>) },
  argTypes: {
    children: { control: false, description: 'The content that overflows.' },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'both'],
      description:
        '`vertical`/`horizontal` render one scrollbar; `both` renders one of each plus the corner.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ScrollArea` class.',
    },
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` are whatever overflows; sizing comes from the theme layer. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'className'),
  args: { children: paragraphs.map((text, index) => <p key={index}>{text}</p>) },
}

/** `orientation` picks which axes get a scrollbar. */
export const Orientation: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <ScrollArea {...args} orientation="vertical" />
      <ScrollArea {...args} orientation="horizontal">
        <div style={{ display: 'flex', gap: '1rem' }}>
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              style={{
                flex: '0 0 auto',
                width: '8rem',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--ds-color-border-subtle)',
              }}
            >
              Card {index + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea {...args} orientation="both">
        {wideGrid}
      </ScrollArea>
    </div>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation'),
  args: { className: 'scrollarea-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.scrollarea-demo-inset { margin: 1rem; }`}</style>
      <ScrollArea {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Root, viewport, content, and a scrollbar with its thumb per axis. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'orientation', 'className'),
  args: { orientation: 'both', children: wideGrid },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The clipped box; sizing comes from the theme.' },
        { id: 'viewport', name: 'Viewport', description: 'The scrolling window.' },
        { id: 'content', name: 'Content', description: 'The wrapper the viewport scrolls.' },
        {
          id: 'scrollbar',
          name: 'Scrollbar',
          description: 'One per axis; only mounted once the content actually overflows.',
        },
        { id: 'thumb', name: 'Thumb', description: 'The draggable handle inside each scrollbar.' },
        {
          id: 'corner',
          name: 'Corner',
          description: 'Only with `orientation="both"` — where the two tracks meet.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

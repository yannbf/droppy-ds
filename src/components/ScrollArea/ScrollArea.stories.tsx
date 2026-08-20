import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './ScrollArea'

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

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
}

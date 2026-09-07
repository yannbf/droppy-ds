import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageSection } from './PageSection'

const meta = {
  title: 'Layout & structure/PageSection',
  component: PageSection,
  args: { title: 'Asian', children: <p>Restaurant cards go here.</p> },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2` above the content.' },
    topButtonLabel: {
      control: 'text',
      description: 'Adds a `clear` Button beside the title. Omitted, no control renders.',
    },
    onTopButtonClick: { description: 'Fired by that button.' },
    children: { control: false, description: 'The section body, below the title row.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-PageSection` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageSection>

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
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: { title: 'Title', children: <p>Content goes here.</p> },
}

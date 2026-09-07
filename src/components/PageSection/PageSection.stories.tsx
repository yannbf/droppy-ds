import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { PageSectionProps } from './PageSection'
import { PageSection } from './PageSection'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof PageSectionProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/**
 * A titled band of page content. Both the title and the optional action are
 * set below, so the controls start populated — clear the label to drop the
 * button.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { title: 'Asian', topButtonLabel: 'View all categories', onTopButtonClick: fn() },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The action is optional and renders nothing at all when `topButtonLabel` is
 * absent — the title row doesn't reserve space for a button that isn't there.
 */
export const ActionIsOptional: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  render: (args) => (
    <>
      <PageSection {...args} title="With an action" topButtonLabel="View all" />
      <PageSection {...args} title="Without one" topButtonLabel={undefined} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The section, its title row, and the optional action inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('title', 'topButtonLabel', 'className'),
  args: { topButtonLabel: 'View all categories', onTopButtonClick: fn() },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The section: title row above, content below.' },
        {
          id: 'top',
          name: 'Top',
          description: 'The title row — heading on one side, optional action on the other.',
        },
        { id: 'title', name: 'Title', description: 'The `h2`.' },
        {
          id: 'action',
          name: 'Action',
          description: 'The `clear` Button, rendered only when `topButtonLabel` is set.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

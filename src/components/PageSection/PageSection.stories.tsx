import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import type { PageSectionProps } from './PageSection'
import { PageSection } from './PageSection'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof PageSectionProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/** `title` renders as an `h2`, so sections nest correctly under a page `h1`. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('topButtonLabel', 'className'),
  args: { title: 'Award winning restaurants', topButtonLabel: undefined },
}

/** `topButtonLabel` adds a `clear` Button beside the title. */
export const TopButtonLabel: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { topButtonLabel: 'View all categories', onTopButtonClick: fn() },
}

/** `children` are the section body, laid out by the caller. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('topButtonLabel', 'className'),
  args: {
    topButtonLabel: undefined,
    children: (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <p>Card one</p>
        <p>Card two</p>
      </div>
    ),
  },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('topButtonLabel'),
  args: {
    className: 'pagesection-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.pagesection-demo-inset { margin: 1rem; }`}</style>
      <PageSection {...args} />
    </>
  ),
}

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
/* ------------------------------------------------------------------ */

export const TestTitleIsALevelTwoHeading: Story = {
  tags: ['tests'],
  args: { topButtonLabel: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Asian' })).toBeInTheDocument()
  },
}

export const TestNoActionWithoutALabel: Story = {
  tags: ['tests'],
  args: { topButtonLabel: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

export const TestActionFiresItsCallback: Story = {
  tags: ['tests'],
  args: { topButtonLabel: 'View all categories', onTopButtonClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View all categories' }))

    await expect(args.onTopButtonClick).toHaveBeenCalledOnce()
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { title: 'Asian', children: <p>Restaurant cards go here.</p> },
}

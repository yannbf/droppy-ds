import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { SpinnerProps } from './Spinner'
import { Spinner } from './Spinner'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SpinnerProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/Spinner',
  component: Spinner,
  argTypes: {
    label: {
      control: 'text',
      description:
        'Accessible name announced while the spinner is visible. The graphic itself is decorative.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Spinner` class.',
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` becomes the accessible name on the `status` role. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'Loading your order' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('label'),
  args: {
    className: 'spinner-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.spinner-demo-inset { margin: 1rem; }`}</style>
      <Spinner {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The graphic is `aria-hidden`, and the name rides on `aria-label` rather than
 * visually-hidden text — `role="status"` doesn't take its name from its
 * content the way a button or heading does.
 */
export const AccessibleName: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { label: 'Finding restaurants near you' },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The status wrapper, the decorative graphic, and the shapes inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `role="status"` wrapper carrying the accessible name.',
        },
        {
          id: 'graphic',
          name: 'Graphic',
          description: 'The `aria-hidden` `<svg>`; nothing inside it is announced.',
        },
        {
          id: 'dot',
          name: 'Dot',
          description: 'Three circles on the same keyframes, staggered by `animation-delay`.',
        },
        { id: 'arc', name: 'Arc', description: 'The two sweeping wedges behind the dots.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

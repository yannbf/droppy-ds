import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { InputProps } from './Input'
import { Input } from './Input'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof InputProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Forms & input/Input',
  component: Input,
  args: { label: 'Full name' },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Also becomes the input’s accessible name.',
    },
    error: {
      control: 'text',
      description: 'Validation message. The slot is reserved whether or not one is showing.',
    },
    type: { control: 'text', description: 'Native input type, passed straight through.' },
    disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
    placeholder: { control: 'text', description: 'Native placeholder, passed straight through.' },
    className: {
      control: 'text',
      description: 'Merged onto the control alongside the component’s own `droppy-Input` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The error slot keeps its height whether or not a message is showing, so
 * validating one field never shifts the ones below it.
 */
export const ErrorDoesNotShiftLayout: Story = {
  tags: ['highlight'],
  argTypes: hide('error', 'className'),
  render: (args) => (
    <>
      <Input {...args} label="Street" error="Enter a street" />
      <Input {...args} label="City" />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Field root, label, control, and the always-mounted error slot. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'error', 'className'),
  args: { error: 'Enter your full name' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Base UI’s `Field.Root`, which wires label, control, and error together.',
        },
        { id: 'label', name: 'Label', description: 'The `<label>`; absent when `label` is empty.' },
        { id: 'control', name: 'Control', description: 'The `<input>` itself.' },
        {
          id: 'error',
          name: 'Error',
          description: 'Always mounted — it holds a non-breaking space when there is no message.',
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

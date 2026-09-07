import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { SelectProps } from './Select'
import { Select } from './Select'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SelectProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Forms & input/Select',
  component: Select,
  args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, onChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'Visible label, rendered above the control.' },
    options: {
      control: 'object',
      description: 'Option values. Each is rendered as both the value and the visible text.',
    },
    value: { control: 'text', description: 'The selected value.' },
    onChange: {
      description: 'Receives the selected value, coerced to a number when the option is numeric.',
    },
    disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Select` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A short, known list — how many servings. Every prop is set below, so the
 * controls start populated; edit the options array to change the list.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, disabled: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Numeric options come back as numbers and text options as strings, so a
 * caller never parses the value first — and a non-numeric option is never
 * turned into `NaN`, which is what Mealdrop's blanket `Number()` did.
 */
export const ValueCoercion: Story = {
  tags: ['highlight'],
  argTypes: hide('options', 'value', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Select {...args} label="servings" options={[1, 2, 3]} value={2} />
      <Select {...args} label="delivery window" options={['ASAP', 'Tonight']} value="ASAP" />
    </div>
  ),
}

/**
 * The control is the native `<select>`. On touch devices that opens the
 * platform picker, which no scripted listbox matches for accessibility or
 * muscle memory — Droppy only restyles it and supplies its own chevron.
 */
export const NativeControl: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Label, a wrapper carrying the chevron, and the native control inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'options', 'value', 'disabled', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The field: label above, control below.' },
        { id: 'label', name: 'Label', description: 'Tied to the control by `for`/`id`.' },
        {
          id: 'wrapper',
          name: 'Wrapper',
          description: 'Positions the chevron over the control, which draws its own.',
        },
        { id: 'control', name: 'Control', description: 'The native `<select>`.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

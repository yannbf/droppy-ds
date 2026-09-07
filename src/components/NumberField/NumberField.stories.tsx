import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { NumberFieldProps } from './NumberField'
import { NumberField } from './NumberField'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof NumberFieldProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Forms & input/NumberField',
  component: NumberField,
  args: { label: 'Quantity', defaultValue: 1, onValueChange: fn() },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Also the accessible name, and the scrub handle.',
    },
    defaultValue: { control: 'number', description: 'Starting value, uncontrolled.' },
    value: {
      control: false,
      description: 'The value, for a controlled field. Pair with `onValueChange`.',
    },
    onValueChange: {
      description: 'Receives the parsed number, or `null` when the field is empty.',
    },
    min: { control: 'number', description: 'Lower bound. The decrement disables here.' },
    max: { control: 'number', description: 'Upper bound. The increment disables here.' },
    step: { control: 'number', description: 'How much each increment moves the value.' },
    disabled: { control: 'boolean', description: 'Disables the input and both buttons.' },
    format: {
      control: false,
      description: '`Intl.NumberFormat` options — currency, percent, decimals.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-NumberField` class.',
    },
  },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` names the field and doubles as the scrub handle. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { label: 'Servings' },
}

/** `defaultValue` seeds the field without making it controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 5 },
}

/** `min` and `max` bound the range; the buttons disable at each end. */
export const MinAndMax: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 9, min: 0, max: 10 },
}

/** `step` sets how far each increment moves. */
export const Step: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 1, step: 0.5 },
}

/** `format` takes `Intl.NumberFormat` options — currency, percent, decimals. */
export const Format: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: {
    label: 'Price',
    defaultValue: 8.5,
    step: 0.25,
    format: { style: 'currency', currency: 'EUR' },
  },
}

/** `disabled` dims the input and both buttons together. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format', 'className'),
  args: { defaultValue: 3, disabled: true },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'format'),
  args: { className: 'numberfield-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.numberfield-demo-inset { margin: 1rem; }`}</style>
      <NumberField {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A field wrapper, the scrub area holding the label, and the button group. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'defaultValue', 'value', 'min', 'max', 'step', 'format', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'field',
          name: 'Field',
          description: 'Base UI’s `Field.Root`, which associates the label with the input.',
        },
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the value, the bounds, and the formatting.',
        },
        {
          id: 'scrub',
          name: 'Scrub area',
          description: 'Wraps the label; dragging it steps the value.',
        },
        { id: 'label', name: 'Label', description: 'The visible label and accessible name.' },
        { id: 'group', name: 'Group', description: 'Holds the two buttons and the input.' },
        { id: 'decrement', name: 'Decrement', description: 'The minus; disabled at `min`.' },
        { id: 'input', name: 'Input', description: 'The typeable control.' },
        { id: 'increment', name: 'Increment', description: 'The plus; disabled at `max`.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

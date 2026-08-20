import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Heading } from '../Heading'

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

/** Mealdrop's checkout form, with two fields in error. */
export const MealdropCheckoutForm: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'error'),
  render: () => (
    <form style={{ display: 'grid', gap: '1.5rem', maxWidth: '30rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <Heading level={3} size={4}>
          Contact details
        </Heading>
        <Input label="Name" defaultValue="Ada Lovelace" />
        <Input label="Email" defaultValue="ada@example" error="Enter a valid email address." />
        <Input label="Phone" defaultValue="06 12345678" />
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <Heading level={3} size={4}>
          Delivery details
        </Heading>
        <Input label="Address" defaultValue="Staalstraat 12" />
        <Input label="Postcode" defaultValue="1011" error="A Dutch postcode looks like 1011 JL." />
        <Input label="City" defaultValue="Amsterdam" />
      </section>
    </form>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

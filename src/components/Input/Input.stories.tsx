import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { Heading } from '../Heading'

import type { InputProps } from './Input'
import { Input } from './Input'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof InputProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/**
 * A labelled text field. Label, type and placeholder are set below, so the
 * controls start populated — type an error message in to see the slot fill
 * without the layout moving.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'Full name', type: 'text', placeholder: 'Ada Lovelace', disabled: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` is both the visible label and the control's accessible name. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'className'),
  args: { label: 'Delivery address' },
}

/** `error` fills the reserved slot beneath the control. */
export const Error: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { error: 'Enter your full name' },
}

/** `type` and the other native input props pass straight through. */
export const Types: Story = {
  tags: ['api-ref'],
  argTypes: hide('type', 'error', 'className'),
  render: (args) => (
    <>
      <Input {...args} label="Email" type="email" />
      <Input {...args} label="Phone" type="tel" />
      <Input {...args} label="Postcode" />
    </>
  ),
}

/** `disabled` is the native attribute; Base UI's `Field` dims the label with it. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'className'),
  args: { disabled: true, placeholder: 'Ada Lovelace' },
}

/** `placeholder` is native too — a hint, never a substitute for the label. */
export const Placeholder: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'className'),
  args: { placeholder: 'Ada Lovelace' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('error'),
  args: { className: 'input-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.input-demo-inset { margin: 1rem; }`}</style>
      <Input {...args} />
    </>
  ),
}

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
/* ------------------------------------------------------------------ */

export const TestLabelNamesTheControl: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')

    await userEvent.type(field, 'Ada Lovelace')

    await expect(field).toHaveValue('Ada Lovelace')
  },
}

export const TestErrorSlotIsAlwaysMounted: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    // No error passed, yet the slot exists — that reservation is what keeps
    // the layout from jumping when validation kicks in.
    await expect(canvasElement.querySelector('.droppy-Field-error')).toBeInTheDocument()
  },
}

export const TestErrorIsAnnounced: Story = {
  tags: ['tests'],
  args: { error: 'Enter your full name' },
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')
    const describedBy = field.getAttribute('aria-describedby')

    await expect(describedBy).toBeTruthy()
    await expect(canvas.getByText('Enter your full name')).toHaveAttribute(
      'id',
      describedBy as string
    )
  },
}

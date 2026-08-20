import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Button } from '../Button'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { ProgressBarProps } from './ProgressBar'
import { ProgressBar } from './ProgressBar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ProgressBarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/ProgressBar',
  component: ProgressBar,
  args: { value: 1, max: 3, label: 'Checkout progress' },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'How far along the track the fill sits. Clamped to 0–`max` before the DOM.',
    },
    max: { control: 'number', description: 'Upper bound `value` is measured against.' },
    label: {
      control: 'text',
      description: 'Accessible name. The visible copy around the bar is the caller’s own markup.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ProgressBar` class.',
    },
  },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  args: { value: 1, max: 3, label: 'Checkout progress' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Value: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem', width: '16rem' }}>
      {[0, 1, 2, 3].map((value) => (
        <ProgressBar {...args} key={value} value={value} />
      ))}
    </div>
  ),
}

export const Max: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { value: 30, max: 40, label: 'Upload progress' },
}

export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'Order preparation' },
}

export const ClassName: Story = {
  tags: ['api-ref'],
  args: {
    className: 'progressbar-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.progressbar-demo-inset { margin: 1rem; }`}</style>
      <div style={{ width: '16rem' }}>
        <ProgressBar {...args} />
      </div>
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

export const OverMaxClamps: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { value: 9, max: 3 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('value', 'max', 'label', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The track: `role="progressbar"` with `aria-valuenow`/`-min`/`-max` and the name.',
        },
        {
          id: 'fill',
          name: 'Fill',
          description: 'The width-driven bar. Purely visual — it carries no ARIA of its own.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

const checkoutSteps = ['Contact details', 'Delivery details']

function CheckoutStepIndicator() {
  const [step, setStep] = useState(1)

  return (
    <Card padded style={{ maxWidth: '30rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}
      >
        <Heading level={3} size={4}>
          {checkoutSteps[step - 1]}
        </Heading>
        <Body size="XS" type="span">
          Step {step} of {checkoutSteps.length}
        </Body>
      </div>

      <ProgressBar value={step} max={checkoutSteps.length} label="Checkout progress" />

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        <Button clear disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
          Previous
        </Button>
        <Button
          disabled={step === checkoutSteps.length}
          onClick={() => setStep((s) => Math.min(checkoutSteps.length, s + 1))}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}

export const MealdropCheckoutSteps: Story = {
  tags: ['examples'],
  argTypes: hide('value', 'max', 'label', 'className'),
  render: () => <CheckoutStepIndicator />,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestReportsItsRange: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '1')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '3')
  },
}

export const TestClampsOverMax: Story = {
  tags: ['tests'],
  args: { value: 9 },
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '3')
    await expect(fill.style.width).toBe('100%')
  },
}

export const TestClampsBelowZero: Story = {
  tags: ['tests'],
  args: { value: -4 },
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '0')
    await expect(fill.style.width).toBe('0%')
  },
}

export const TestFillIsNotAnnounced: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    // Exactly one progressbar in the tree: the fill is a plain div.
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(1)
    await expect(canvasElement.querySelector('.droppy-ProgressBar-fill')).not.toHaveAttribute(
      'role'
    )
  },
}

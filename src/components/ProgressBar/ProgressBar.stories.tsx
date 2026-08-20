import { useState } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Button } from '../Button'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { ProgressBarProps } from './ProgressBar'
import { ProgressBar } from './ProgressBar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ProgressBarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The track carries the ARIA; the fill is a decorative sibling underneath it. */
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

/** Mealdrop's checkout step indicator. */
export const MealdropCheckoutSteps: Story = {
  tags: ['examples'],
  argTypes: hide('value', 'max', 'label', 'className'),
  render: () => <CheckoutStepIndicator />,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

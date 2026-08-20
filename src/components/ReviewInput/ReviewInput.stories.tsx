import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import type { ReviewInputProps } from './ReviewInput'
import { ReviewInput } from './ReviewInput'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewInputProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Forms & input/ReviewInput',
  component: ReviewInput,
  args: {
    ratingLabel: 'Your rating',
    bodyLabel: 'Your review',
    bodyPlaceholder: 'Tell us what you thought',
    onValueChange: fn(),
  },
  argTypes: {
    ratingLabel: {
      control: 'text',
      description: 'Accessible name and visible legend for the rating radiogroup.',
    },
    bodyLabel: {
      control: 'text',
      description: 'Visible label for the review-text field. Also its accessible name.',
    },
    bodyPlaceholder: {
      control: 'text',
      description: 'Native placeholder for the review-text field.',
    },
    defaultValue: {
      control: 'object',
      description: "Starting value, uncontrolled. Missing keys default to `0` / `''`.",
    },
    value: {
      control: false,
      description: 'The value, for a controlled field. Pair with `onValueChange`.',
    },
    onValueChange: {
      description: 'Receives the merged `{ rating, body }` whenever either piece changes.',
    },
    disabled: { control: 'boolean', description: 'Disables the rating and the text field.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ReviewInput` class.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewInput>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Five star radio buttons and a review-text field. Pick a star, or tab to it
 * and use the arrow keys — the text field is a normal Tab stop after it.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { disabled: false },
  argTypes: hide('value', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `ratingLabel` names the star radiogroup, both visibly and for assistive tech. */
export const RatingLabel: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: { ratingLabel: 'Rate your order' },
}

/** `bodyLabel` names the review-text field. */
export const BodyLabel: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: { bodyLabel: 'What went well or badly?' },
}

/** `bodyPlaceholder` is a hint inside the empty text field, never a label substitute. */
export const BodyPlaceholder: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: { bodyPlaceholder: 'The delivery was fast and the food was still hot…' },
}

/** `defaultValue` seeds the field without making it controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: { defaultValue: { rating: 4, body: 'Great order, arrived on time.' } },
}

/** `disabled` dims the stars and the text field together. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  args: { defaultValue: { rating: 3, body: 'Left before I could edit further.' }, disabled: true },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value'),
  args: { className: 'reviewinput-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.reviewinput-demo-inset { margin: 1rem; }`}</style>
      <ReviewInput {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The rating is a real radiogroup: five radio inputs, one per star value.
 * Tab lands on the checked (or first) star, then Left/Right or Up/Down moves
 * and selects in one step — the WAI-ARIA radio pattern, not a click handler
 * bolted onto a `div`. Each star's accessible name is "N of 5 stars".
 */
export const AccessibleRadiogroup: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'className'),
  args: { defaultValue: { rating: 2, body: '' } },
}

/**
 * Every star at or below the chosen rating renders filled, in the same ink
 * `Review` uses for its own star glyph — a 3-star rating shows three filled
 * stars side by side, not just the third one lit up.
 */
export const FilledStarsTrackRating: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {[0, 1, 3, 5].map((rating) => (
        <ReviewInput {...args} key={rating} defaultValue={{ rating, body: '' }} />
      ))}
    </div>
  ),
}

/**
 * Passing `value` makes the field fully controlled: it renders exactly what
 * the caller passes, and only calls `onValueChange` in response to
 * interaction — it never updates itself.
 */
export const ControlledValue: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'defaultValue', 'className'),
  args: { value: { rating: 2, body: 'Pinned by the caller.' } },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A rating fieldset (legend, radiogroup, five stars) and a labelled text field. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide(
    'ratingLabel',
    'bodyLabel',
    'bodyPlaceholder',
    'defaultValue',
    'value',
    'disabled',
    'className'
  ),
  args: { defaultValue: { rating: 3, body: 'Anatomy demo.' } },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The wrapper the caller positions.' },
        {
          id: 'rating-field',
          name: 'Rating field',
          description: 'Base UI’s `Fieldset.Root`, grouping the five stars under one legend.',
        },
        {
          id: 'rating-label',
          name: 'Rating label',
          description: 'The fieldset’s legend — its accessible name for the group.',
        },
        {
          id: 'rating',
          name: 'Rating',
          description: 'The radiogroup itself; owns which star is selected.',
        },
        {
          id: 'star',
          name: 'Star',
          description: 'One radio per rating value, labelled "N of 5 stars".',
        },
        {
          id: 'body-field',
          name: 'Body field',
          description: 'Base UI’s `Field.Root`, associating the label with the text field.',
        },
        { id: 'body-label', name: 'Body label', description: 'The visible and accessible name.' },
        {
          id: 'body',
          name: 'Body',
          description: 'The `<textarea>` the review text is typed into.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Origin: [droppy-ds#298](https://github.com/yannbf/droppy-ds/issues/298) — agents
 * building on Mealdrop were observed hand-rolling their own editable review widget
 * to let a shopper rate a past order, because the design system only shipped the
 * read-only `Review`. The story to write: Mealdrop's order-history row — "Delivered
 * Tuesday" beside a collapsed `ReviewInput` that expands on "Rate this order", since
 * that's the exact interaction Steve saw agents reinventing.
 */
export const MealdropRateAPastOrder: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestEachStarHasAnAccessibleName: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    for (const n of [1, 2, 3, 4, 5]) {
      await expect(canvas.getByRole('radio', { name: `${n} of 5 stars` })).toBeInTheDocument()
    }
  },
}

export const TestKeyboardArrowSelectsRating: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    const firstStar = canvas.getByRole('radio', { name: '1 of 5 stars' })

    firstStar.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')

    const thirdStar = canvas.getByRole('radio', { name: '3 of 5 stars' })
    await waitFor(() => expect(thirdStar).toBeChecked())
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ rating: 3, body: '' })
  },
}

export const TestClickSelectsRating: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: '4 of 5 stars' }))

    await waitFor(() => expect(canvas.getByRole('radio', { name: '4 of 5 stars' })).toBeChecked())
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ rating: 4, body: '' })
  },
}

export const TestBodyTextUpdatesValue: Story = {
  tags: ['tests'],
  args: { defaultValue: { rating: 5, body: '' } },
  play: async ({ args, canvas }) => {
    const field = canvas.getByLabelText('Your review')

    await userEvent.type(field, 'Great!')

    await waitFor(() => expect(field).toHaveValue('Great!'))
    // The rating already chosen survives a text-only edit — the two pieces
    // update independently but are always reported together.
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ rating: 5, body: 'Great!' })
  },
}

export const TestDisabledPreventsInteraction: Story = {
  tags: ['tests'],
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: '1 of 5 stars' })).toHaveAttribute(
      'data-disabled'
    )
    await expect(canvas.getByLabelText('Your review')).toBeDisabled()
  },
}

export const TestControlledValueNeverUpdatesItself: Story = {
  tags: ['tests'],
  args: { value: { rating: 1, body: '' } },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: '5 of 5 stars' }))

    await expect(args.onValueChange).toHaveBeenLastCalledWith({ rating: 5, body: '' })
    // The caller never fed the new value back in, so the control still shows
    // what it was told to render.
    await expect(canvas.getByRole('radio', { name: '1 of 5 stars' })).toBeChecked()
  },
}

import { useId, useState } from 'react'
import { Field } from '@base-ui/react/field'
import { Fieldset } from '@base-ui/react/fieldset'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import theme from '../../theme'

import { Icon } from '../Icon'
import { cx } from '../../utils/cx'

const STAR_VALUES = [1, 2, 3, 4, 5]

export type ReviewInputValue = {
  /** Star rating, 1–5. `0` means no rating chosen yet. */
  rating: number
  /** The review text. */
  body: string
}

type DefaultProps = {
  /** Accessible name (and visible legend) for the rating control. */
  ratingLabel?: string
  /** Visible label for the review-text field. Also becomes its accessible name. */
  bodyLabel?: string
  /** Native placeholder for the review-text field. */
  bodyPlaceholder?: string
  /** Starting value, uncontrolled. Missing keys default to `0` / `''`. */
  defaultValue?: Partial<ReviewInputValue>
  /** The value, for a controlled field. Pair with `onValueChange`. */
  value?: ReviewInputValue
  /** Receives the merged value whenever the rating or the text changes. */
  onValueChange?: (value: ReviewInputValue) => void
  disabled?: boolean
  className?: string
}

export type ReviewInputProps = DefaultProps

/**
 * An editable star rating and a review-text field, for rating something
 * already received — a past order, a delivered item — as opposed to `Review`,
 * which only displays an aggregate score.
 *
 * The rating is a real radiogroup: five radio inputs, one per star value,
 * each with its own "N of 5 stars" accessible name — arrow keys move the
 * selection and a screen reader announces it like any other radio group.
 * The review text reuses `Field`, the same label/error wiring `Input` and
 * `NumberField` build on, rendering a `<textarea>` in place of the default
 * `<input>`.
 */
export const ReviewInput = ({
  ratingLabel = 'Your rating',
  bodyLabel = 'Your review',
  bodyPlaceholder = 'Tell us what you thought',
  defaultValue,
  value,
  onValueChange,
  disabled = false,
  className,
}: ReviewInputProps) => {
  const nameId = useId()
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<ReviewInputValue>({
    rating: defaultValue?.rating ?? 0,
    body: defaultValue?.body ?? '',
  })
  const current = isControlled ? value : internalValue

  const update = (patch: Partial<ReviewInputValue>) => {
    const next = { ...current, ...patch }

    if (!isControlled) {
      setInternalValue(next)
    }

    onValueChange?.(next)
  }

  return (
    <div data-part="root" className={cx('droppy-ReviewInput', className)}>
      <Fieldset.Root
        data-part="rating-field"
        className="droppy-ReviewInput-ratingField"
        disabled={disabled}
      >
        <Fieldset.Legend data-part="rating-label" className="droppy-ReviewInput-ratingLabel">
          {ratingLabel}
        </Fieldset.Legend>
        <RadioGroup<number>
          data-part="rating"
          name={`rating-${nameId}`}
          disabled={disabled}
          className="droppy-ReviewInput-stars"
          // Always a number, never `undefined` — `0` (no star value matches
          // it) is the "nothing selected" sentinel, so the group stays
          // controlled from the first render instead of switching partway
          // through the component's life, which Base UI warns against.
          value={current.rating}
          onValueChange={(next) => update({ rating: next })}
        >
          {STAR_VALUES.map((star) => (
            <Radio.Root<number>
              key={star}
              data-part="star"
              value={star}
              disabled={disabled}
              data-filled={star <= current.rating ? '' : undefined}
              className="droppy-ReviewInput-star"
              aria-label={`${star} of 5 stars`}
            >
              <Icon name="star" className="droppy-ReviewInput-starIcon" />
            </Radio.Root>
          ))}
        </RadioGroup>
      </Fieldset.Root>

      <Field.Root
        data-part="body-field"
        className={cx(theme.FieldRoot, 'droppy-Field')}
        disabled={disabled}
      >
        <Field.Label data-part="body-label" className={theme.FieldLabel}>
          {bodyLabel}
        </Field.Label>
        <Field.Control
          data-part="body"
          render={<textarea rows={4} />}
          className={cx(theme.Input, 'droppy-ReviewInput-body')}
          placeholder={bodyPlaceholder}
          disabled={disabled}
          value={current.body}
          onValueChange={(next) => update({ body: next })}
        />
      </Field.Root>
    </div>
  )
}

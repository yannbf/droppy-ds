import { useId, type ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Visible label, rendered above the control. */
  label?: string
  /** Option values. Rendered as both the value and the visible text. */
  options?: Array<string | number>
  value?: string | number
  /** Receives the selected value, coerced to a number when the option is numeric. */
  onChange?: (value: string | number) => void
}

export type SelectProps = DefaultProps & Omit<ComponentProps<'select'>, keyof DefaultProps>

/**
 * A single-choice control over a short, known list.
 *
 * Uses the native `<select>` — on touch devices it opens the platform picker,
 * which no scripted listbox matches for accessibility or muscle memory. Droppy
 * restyles the control and supplies its own chevron.
 */
export const Select = ({
  label = '',
  value = '',
  options = [],
  onChange,
  id,
  className,
  ...rest
}: SelectProps) => {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={cx('droppy-Select', className)}>
      {label && (
        <label className="droppy-Select-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className="droppy-Select-controlWrapper">
        <select
          id={selectId}
          className="droppy-Select-control"
          value={value}
          onChange={(event) => {
            const { value: raw } = event.target
            // Numeric options are far and away the common case (quantities,
            // servings), so hand those back as numbers — but never turn a
            // non-numeric option into NaN.
            onChange?.(raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw)
          }}
          {...rest}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

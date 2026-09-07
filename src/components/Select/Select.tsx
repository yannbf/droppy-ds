import { useId, type ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  label?: string
  options?: Array<string | number>
  value?: string | number
  onChange?: (value: string | number) => void
}

export type SelectProps = DefaultProps & Omit<ComponentProps<'select'>, keyof DefaultProps>

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
    <div data-part="root" className={cx('droppy-Select', className)}>
      {label && (
        <label data-part="label" className="droppy-Select-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div data-part="wrapper" className="droppy-Select-controlWrapper">
        <select
          data-part="control"
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

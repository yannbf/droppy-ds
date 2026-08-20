import { Body } from '../Body'
import { Button } from '../Button'
import { cx } from '../../utils/cx'

export type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  'aria-label'?: string
  className?: string
}

export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 10,
  'aria-label': ariaLabel = 'quantity',
  className,
}: QuantityStepperProps) => (
  <div
    data-part="root"
    role="group"
    aria-label={ariaLabel}
    className={cx('droppy-QuantityStepper', className)}
  >
    <Button
      data-part="decrement"
      aria-label="decrease quantity by one"
      round
      clear
      icon="minus"
      onClick={() => onChange(value - 1)}
      disabled={value <= min}
    />
    <Body data-part="value" type="span" aria-live="polite" className="droppy-QuantityStepper-value">
      {value}
    </Body>
    <Button
      data-part="increment"
      aria-label="increase quantity by one"
      round
      clear
      icon="plus"
      onClick={() => onChange(value + 1)}
      disabled={value >= max}
    />
  </div>
)

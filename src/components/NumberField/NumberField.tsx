import type { ComponentProps } from 'react'
import { Field } from '@base-ui/react/field'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import theme from '../../theme'

import { Icon } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Visible label. Also becomes the field's accessible name. */
  label?: string
  disabled?: boolean
  className?: string
}

export type NumberFieldProps = DefaultProps &
  Omit<ComponentProps<typeof BaseNumberField.Root>, keyof DefaultProps | 'render'>

/**
 * A typeable numeric input with increment/decrement buttons and pointer
 * scrub, for a quantity or amount that can also be reached by keyboard or
 * direct entry — unlike `QuantityStepper`, which only supports tap-tap
 * bounded increments.
 *
 * Built on Base UI's `NumberField`, wrapped in `Field` so the label is
 * associated with the control the same way `Input` does it. The label sits
 * inside a `ScrubArea`, so dragging it also changes the value, in addition
 * to typing, arrow keys, and the increment/decrement buttons.
 */
export const NumberField = ({ label, disabled, className, ...rest }: NumberFieldProps) => (
  <Field.Root className={cx(theme.FieldRoot, 'droppy-Field')} disabled={disabled}>
    <BaseNumberField.Root
      disabled={disabled}
      className={cx(theme.NumberFieldRoot, 'droppy-NumberField', className)}
      {...rest}
    >
      {label && (
        <BaseNumberField.ScrubArea className={theme.NumberFieldScrubArea}>
          <Field.Label className={theme.FieldLabel}>{label}</Field.Label>
          <BaseNumberField.ScrubAreaCursor className={theme.NumberFieldScrubAreaCursor} />
        </BaseNumberField.ScrubArea>
      )}
      <BaseNumberField.Group className={theme.NumberFieldGroup}>
        <BaseNumberField.Decrement className={theme.NumberFieldDecrement}>
          <Icon name="minus" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className={theme.NumberFieldInput} />
        <BaseNumberField.Increment className={theme.NumberFieldIncrement}>
          <Icon name="plus" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  </Field.Root>
)

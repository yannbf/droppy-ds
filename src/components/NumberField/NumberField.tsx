import type { ComponentProps } from 'react'
import { Field } from '@base-ui/react/field'
import { NumberField as BaseNumberField } from '@base-ui/react/number-field'
import theme from '../../theme'

import { Icon } from '../Icon'
import { cx } from '../../utils/cx'

type DefaultProps = {
  label?: string
  disabled?: boolean
  className?: string
}

export type NumberFieldProps = DefaultProps &
  Omit<ComponentProps<typeof BaseNumberField.Root>, keyof DefaultProps | 'render'>

export const NumberField = ({ label, disabled, className, ...rest }: NumberFieldProps) => (
  <Field.Root data-part="field" className={cx(theme.FieldRoot, 'droppy-Field')} disabled={disabled}>
    <BaseNumberField.Root
      data-part="root"
      disabled={disabled}
      className={cx(theme.NumberFieldRoot, 'droppy-NumberField', className)}
      {...rest}
    >
      {label && (
        <BaseNumberField.ScrubArea data-part="scrub" className={theme.NumberFieldScrubArea}>
          <Field.Label data-part="label" className={theme.FieldLabel}>
            {label}
          </Field.Label>
          <BaseNumberField.ScrubAreaCursor className={theme.NumberFieldScrubAreaCursor} />
        </BaseNumberField.ScrubArea>
      )}
      <BaseNumberField.Group data-part="group" className={theme.NumberFieldGroup}>
        <BaseNumberField.Decrement data-part="decrement" className={theme.NumberFieldDecrement}>
          <Icon name="minus" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input data-part="input" className={theme.NumberFieldInput} />
        <BaseNumberField.Increment data-part="increment" className={theme.NumberFieldIncrement}>
          <Icon name="plus" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  </Field.Root>
)

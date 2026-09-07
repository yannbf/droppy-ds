import type { ComponentProps } from 'react'
import { Field } from '@base-ui/react/field'
import { Input as BaseInput } from '@base-ui/react/input'
import theme from '../../theme'

import { cx } from '../../utils/cx'

type DefaultProps = {
  label?: string
  error?: string
}

export type InputProps = DefaultProps & Omit<ComponentProps<'input'>, keyof DefaultProps>

export const Input = ({ label = '', type = 'text', id, error, className, ...rest }: InputProps) => (
  <Field.Root data-part="root" className={cx(theme.FieldRoot, 'droppy-Field')}>
    {label && (
      <Field.Label data-part="label" className={theme.FieldLabel}>
        {label}
      </Field.Label>
    )}
    <BaseInput
      data-part="control"
      id={id}
      type={type}
      className={cx(theme.Input, 'droppy-Input', className)}
      autoComplete="off"
      {...rest}
    />
    {/* `match` keeps the slot mounted whether or not there is an error, so the
        reserved min-height holds the layout steady. The child overrides Field's
        own computed message while keeping the aria-describedby wiring. */}
    <Field.Error data-part="error" className={cx(theme.FieldError, 'droppy-Field-error')} match>
      {error || ' '}
    </Field.Error>
  </Field.Root>
)

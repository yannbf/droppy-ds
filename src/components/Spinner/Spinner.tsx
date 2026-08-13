import type { ComponentProps } from 'react'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Accessible name announced while the spinner is visible. The graphic
   *  itself is decorative. */
  label?: string
  className?: string
}

export type SpinnerProps = DefaultProps & Omit<ComponentProps<'div'>, keyof DefaultProps>

/**
 * An indeterminate loading indicator — three dots crossing an arc, in the
 * theme's brand colors.
 *
 * Announces itself with `role="status"` and `aria-label`, so a screen reader
 * gets a busy state even though the SVG graphic carries no visible text.
 * `status` doesn't derive its accessible name from its content the way a
 * button or heading does, so the label has to be `aria-label` rather than
 * visually-hidden text in the DOM.
 */
export const Spinner = ({ label = 'Loading', className, ...rest }: SpinnerProps) => (
  <div
    data-part="root"
    role="status"
    aria-label={label}
    className={cx('droppy-Spinner', className)}
    {...rest}
  >
    <svg
      data-part="graphic"
      className="droppy-Spinner-graphic"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      aria-hidden="true"
      focusable="false"
    >
      <g>
        <circle
          data-part="dot"
          cx="95"
          cy="50"
          r="4"
          className="droppy-Spinner-dot droppy-Spinner-dot--1"
        />
        <circle
          data-part="dot"
          cx="95"
          cy="50"
          r="4"
          className="droppy-Spinner-dot droppy-Spinner-dot--2"
        />
        <circle
          data-part="dot"
          cx="95"
          cy="50"
          r="4"
          className="droppy-Spinner-dot droppy-Spinner-dot--3"
        />
      </g>
      <g transform="translate(-15 0)">
        <path
          data-part="arc"
          d="M50 50L20 50A30 30 0 0 0 80 50Z"
          className="droppy-Spinner-arc"
          transform="rotate(90 50 50)"
        />
        <path
          data-part="arc"
          d="M50 50L20 50A30 30 0 0 0 80 50Z"
          className="droppy-Spinner-arc droppy-Spinner-arc--a"
        />
        <path
          data-part="arc"
          d="M50 50L20 50A30 30 0 0 1 80 50Z"
          className="droppy-Spinner-arc droppy-Spinner-arc--b"
        />
      </g>
    </svg>
  </div>
)

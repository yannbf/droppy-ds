import type { ReactNode } from 'react'

import { Body } from '../Body'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { cx } from '../../utils/cx'

export type ErrorBlockProps = {
  title: string
  /** Illustration slot — an inline SVG, an image, or an animation the caller drives itself.
   *  Omitted, the block renders with no illustration at all. */
  illustration?: ReactNode
  body: string
  buttonText: string
  onButtonClick: () => void
  className?: string
}

/**
 * A titled message with an optional illustration and a single recovery action —
 * an empty category, a 404, a failed request.
 */
export const ErrorBlock = ({
  title,
  illustration,
  body,
  buttonText,
  onButtonClick,
  className,
}: ErrorBlockProps) => (
  <div className={cx('droppy-ErrorBlock', className)}>
    <Heading level={2}>{title}</Heading>
    {illustration && <div className="droppy-ErrorBlock-illustration">{illustration}</div>}
    <Body>{body}</Body>
    <Button onClick={onButtonClick}>{buttonText}</Button>
  </div>
)

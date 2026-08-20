import type { ReactNode } from 'react'

import { Body } from '../Body'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { cx } from '../../utils/cx'

export type ErrorBlockProps = {
  title: string
  illustration?: ReactNode
  body: string
  buttonText: string
  onButtonClick: () => void
  className?: string
}

export const ErrorBlock = ({
  title,
  illustration,
  body,
  buttonText,
  onButtonClick,
  className,
}: ErrorBlockProps) => (
  <div data-part="root" className={cx('droppy-ErrorBlock', className)}>
    <Heading data-part="title" level={2}>
      {title}
    </Heading>
    {illustration && (
      <div data-part="illustration" className="droppy-ErrorBlock-illustration">
        {illustration}
      </div>
    )}
    <Body data-part="body">{body}</Body>
    <Button data-part="action" onClick={onButtonClick}>
      {buttonText}
    </Button>
  </div>
)

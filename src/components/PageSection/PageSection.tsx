import type { ReactNode } from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { cx } from '../../utils/cx'

export type PageSectionProps = {
  title: string
  topButtonLabel?: string
  onTopButtonClick?: () => void
  className?: string
  children: ReactNode
}

export const PageSection = ({
  title,
  topButtonLabel,
  onTopButtonClick,
  className,
  children,
}: PageSectionProps) => (
  <div className={cx('droppy-PageSection', className)}>
    <div className="droppy-PageSection__top">
      <Heading level={2}>{title}</Heading>
      {topButtonLabel && (
        <Button clear onClick={onTopButtonClick}>
          {topButtonLabel}
        </Button>
      )}
    </div>
    {children}
  </div>
)

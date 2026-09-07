import { Heading } from '../Heading'
import type { HeadingProps } from '../Heading'
import { cx } from '../../utils/cx'

export type TopBannerProps = {
  title?: string
  level?: HeadingProps['level']
  photoUrl?: string
  onBackClick?: () => void
  className?: string
}

export const TopBanner = ({ title, level = 1, photoUrl, className }: TopBannerProps) => (
  <div
    data-part="root"
    className={cx('droppy-TopBanner', className)}
    style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
  >
    {title && (
      <Heading
        data-part="title"
        level={level}
        className={cx(
          'droppy-TopBanner__heading',
          photoUrl && 'droppy-TopBanner__heading--onPhoto'
        )}
      >
        {title}
      </Heading>
    )}
  </div>
)

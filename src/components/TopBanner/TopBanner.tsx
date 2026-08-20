import { Heading } from '../Heading'
import { cx } from '../../utils/cx'

export type TopBannerProps = {
  title?: string
  photoUrl?: string
  onBackClick?: () => void
  className?: string
}

export const TopBanner = ({ title, photoUrl, className }: TopBannerProps) => (
  <div
    data-part="root"
    className={cx('droppy-TopBanner', className)}
    style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
  >
    {title && (
      <Heading
        data-part="title"
        level={2}
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

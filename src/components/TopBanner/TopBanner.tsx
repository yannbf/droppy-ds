import { Heading } from '../Heading'
import { cx } from '../../utils/cx'

export type TopBannerProps = {
  title?: string
  photoUrl?: string
  /** Accepted for call-site parity with Mealdrop's `TopBanner`, which passes this to a back
   *  button that's commented out in its own source. `TopBanner` renders no control of its
   *  own, so the callback is never invoked. */
  onBackClick?: () => void
  className?: string
}

export const TopBanner = ({ title, photoUrl, className }: TopBannerProps) => (
  <div
    className={cx('droppy-TopBanner', className)}
    style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
  >
    {title && (
      <Heading
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

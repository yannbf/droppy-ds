import { Heading } from '../Heading'
import type { HeadingProps } from '../Heading'
import { cx } from '../../utils/cx'

export type TopBannerProps = {
  title?: string
  /** Heading level of the title. Defaults to 1: the banner sits at the top of the page and
   *  usually carries its primary title, so the outline starts here. Pass a deeper level when
   *  the page's `h1` lives elsewhere. */
  level?: HeadingProps['level']
  photoUrl?: string
  /** Accepted for call-site parity with Mealdrop's `TopBanner`, which passes this to a back
   *  button that's commented out in its own source. `TopBanner` renders no control of its
   *  own, so the callback is never invoked. */
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

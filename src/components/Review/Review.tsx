import { Body } from '../Body'
import { cx } from '../../utils/cx'

export type ReviewProps = {
  /** Average rating out of 5. Unset (or falsy) renders "No reviews yet". */
  rating?: number
  /** Overrides the text color. Unset, uses the low-contrast review text token
   *  (`--ds-color-text-review`), matching the design's intentionally quiet
   *  default treatment for review lines. */
  color?: string
  className?: string
}

const getReviewLabel = (rating?: number) => {
  if (!rating) {
    return 'No reviews yet'
  }

  let label = 'Very poor'

  if (rating >= 2 && rating < 4) {
    label = 'Adequate'
  } else if (rating >= 4 && rating < 5) {
    label = 'Very good'
  } else if (rating >= 5) {
    label = 'Excellent'
  }

  return `★ ${rating.toFixed(1)} ${label}`
}

/**
 * A star-rating and text line — "★ 4.5 Very good" or "No reviews yet" — for a
 * restaurant tile, an item card, or an order summary.
 */
export const Review = ({ rating, color, className }: ReviewProps) => (
  <div data-part="root" className={cx('droppy-Review', className)}>
    <Body data-part="text" size="S" type="span" color={color} className="droppy-Review-text">
      {getReviewLabel(rating)}
    </Body>
  </div>
)

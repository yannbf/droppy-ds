import { Body } from '../Body'
import { cx } from '../../utils/cx'

export type ReviewProps = {
  rating?: number
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

export const Review = ({ rating, color, className }: ReviewProps) => (
  <div data-part="root" className={cx('droppy-Review', className)}>
    <Body data-part="text" size="S" type="span" color={color} className="droppy-Review-text">
      {getReviewLabel(rating)}
    </Body>
  </div>
)

import type { ComponentProps, ReactNode } from 'react'

import { Body } from '../Body'
import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Image URL. */
  src: string
  /** Accessible description. Pass `alt=""` for a purely decorative image — screen readers skip it. */
  alt: string
  /** Rendered as a real `<figcaption>` via `Body`. Omitted, the figure carries no caption at all. */
  caption?: ReactNode
  /** Floats the caption over the image's top-left corner instead of below it — the squared
   *  MealDrop tile look. Has no effect when `round` is set. */
  captionOverlay?: boolean
  /** Circular image with the caption below — the avatar-tile look. Takes precedence over
   *  `captionOverlay`, since a floating chip has no circular-safe corner to sit in. */
  round?: boolean
  /** Adds Card's surface classes (background, radius, clipping) to the root — the "round avatar
   *  inside a Card" look. Reuses `droppy-Card`'s own CSS rather than duplicating them. */
  shell?: boolean
  className?: string
}

export type ImageCardProps = DefaultProps & Omit<ComponentProps<'figure'>, keyof DefaultProps>

export const ImageCard = ({
  src,
  alt,
  caption,
  captionOverlay = false,
  round = false,
  shell = false,
  className,
  ...rest
}: ImageCardProps) => {
  const overlay = captionOverlay && !round

  return (
    <figure
      data-part="root"
      className={cx(
        'droppy-ImageCard',
        round && 'droppy-ImageCard--round',
        shell && 'droppy-Card',
        shell && 'droppy-Card--padded',
        className
      )}
      {...rest}
    >
      <img data-part="image" className="droppy-ImageCard-image" src={src} alt={alt} />
      {caption != null && (
        <Body
          data-part="caption"
          type="figcaption"
          size="XS"
          className={cx('droppy-ImageCard-caption', overlay && 'droppy-ImageCard-caption--overlay')}
          color={overlay ? 'var(--ds-color-chip-contrast-text)' : undefined}
        >
          {caption}
        </Body>
      )}
    </figure>
  )
}

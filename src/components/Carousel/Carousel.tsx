import { Children, useCallback, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

import { IconButton } from '../IconButton'
import { cx } from '../../utils/cx'

export type ItemsPerView = {
  mobile: number
  tablet: number
  desktop: number
}

export type CarouselProps = {
  children: ReactNode
  /** Number of items visible per breakpoint (mobile-first). */
  itemsPerView: ItemsPerView
  /** How many items each arrow click advances, per breakpoint (defaults to 1). */
  slidesToScroll?: Partial<ItemsPerView>
  className?: string
}

// Matches --ds-breakpoint-sm and --ds-breakpoint-lg; media queries (used by
// `matchMedia` below, same as in the component's CSS) can't read custom
// properties.
const TABLET_QUERY = '(min-width: 640px)'
const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * A horizontally scrolling row of items — restaurant cards, category tiles —
 * showing a fixed number per breakpoint with drag, wheel-gesture, and arrow
 * navigation.
 *
 * Non-visible or partially scrolled slides dim to signal there's more to
 * scroll to. Arrows only render once there's somewhere to go in that
 * direction, and only appear on desktop; smaller screens scroll by dragging.
 */
export const Carousel = ({ children, itemsPerView, slidesToScroll, className }: CarouselProps) => {
  const step = { mobile: 1, tablet: 1, desktop: 1, ...slidesToScroll }
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      // watchDrag defaults to true, so both mouse and touch dragging work.
      // A slide counts as "in view" only when almost fully visible, so
      // partially scrolled slides are dimmed (see below).
      inViewThreshold: 0.95,
    },
    // Horizontal wheel / trackpad and shift+scroll move the carousel;
    // vertical scrolling still scrolls the page.
    [WheelGesturesPlugin()]
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [slidesInView, setSlidesInView] = useState<number[]>([])
  const slideCount = Children.count(children)

  // How many slides an arrow click advances at the current breakpoint.
  const stepForViewport = useCallback(() => {
    if (typeof globalThis.matchMedia === 'function') {
      if (globalThis.matchMedia(DESKTOP_QUERY).matches) return step.desktop
      if (globalThis.matchMedia(TABLET_QUERY).matches) return step.tablet
    }
    return step.mobile
  }, [step.mobile, step.tablet, step.desktop])

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(Math.max(emblaApi.selectedScrollSnap() - stepForViewport(), 0))
  }, [emblaApi, stepForViewport])

  const scrollNext = useCallback(() => {
    if (!emblaApi) return
    const lastSnap = emblaApi.scrollSnapList().length - 1
    emblaApi.scrollTo(Math.min(emblaApi.selectedScrollSnap() + stepForViewport(), lastSnap))
  }, [emblaApi, stepForViewport])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  const onSlidesInView = useCallback(() => {
    if (!emblaApi) return
    setSlidesInView(emblaApi.slidesInView())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    onSlidesInView()
    emblaApi
      .on('select', onSelect)
      .on('slidesInView', onSlidesInView)
      .on('reInit', onSelect)
      .on('reInit', onSlidesInView)
    return () => {
      emblaApi
        .off('select', onSelect)
        .off('slidesInView', onSlidesInView)
        .off('reInit', onSelect)
        .off('reInit', onSlidesInView)
    }
  }, [emblaApi, onSelect, onSlidesInView])

  // Re-measure when the set of slides changes (e.g. loading skeletons swapped
  // for the real content), otherwise Embla keeps stale sizes and can't scroll.
  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, slideCount])

  return (
    <div
      className={cx('droppy-Carousel', className)}
      style={
        {
          '--droppy-Carousel-items-mobile': itemsPerView.mobile,
          '--droppy-Carousel-items-tablet': itemsPerView.tablet,
          '--droppy-Carousel-items-desktop': itemsPerView.desktop,
        } as CSSProperties
      }
    >
      {canScrollPrev && (
        <IconButton
          name="arrow-left"
          aria-label="Previous"
          onClick={scrollPrev}
          className="droppy-Carousel-nav droppy-Carousel-nav--prev"
        />
      )}
      <div className="droppy-Carousel-viewport" ref={emblaRef}>
        <div className="droppy-Carousel-container">
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className={cx(
                'droppy-Carousel-slide',
                slidesInView.length > 0 &&
                  !slidesInView.includes(index) &&
                  'droppy-Carousel-slide--dimmed'
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {canScrollNext && (
        <IconButton
          name="arrow-right"
          aria-label="Next"
          onClick={scrollNext}
          className="droppy-Carousel-nav droppy-Carousel-nav--next"
        />
      )}
    </div>
  )
}

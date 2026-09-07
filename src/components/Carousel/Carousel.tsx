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
  itemsPerView: ItemsPerView
  slidesToScroll?: Partial<ItemsPerView>
  className?: string
}

// Matches --ds-breakpoint-sm and --ds-breakpoint-lg; media queries (used by
// `matchMedia` below, same as in the component's CSS) can't read custom
// properties.
const TABLET_QUERY = '(min-width: 640px)'
const DESKTOP_QUERY = '(min-width: 1024px)'

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
      data-part="root"
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
          data-part="nav"
          name="arrow-left"
          aria-label="Previous"
          onClick={scrollPrev}
          className="droppy-Carousel-nav droppy-Carousel-nav--prev"
        />
      )}
      <div data-part="viewport" className="droppy-Carousel-viewport" ref={emblaRef}>
        <div data-part="container" className="droppy-Carousel-container">
          {Children.map(children, (child, index) => (
            <div
              key={index}
              data-part="slide"
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
          data-part="nav"
          name="arrow-right"
          aria-label="Next"
          onClick={scrollNext}
          className="droppy-Carousel-nav droppy-Carousel-nav--next"
        />
      )}
    </div>
  )
}

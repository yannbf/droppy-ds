import type { ComponentProps, PropsWithChildren, ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'

import { cx } from '../../utils/cx'

type DefaultProps = {
  /** Destination for the default `<a>`. Ignored when `render` is set — the
   *  passed element owns its own destination (e.g. a router `to` prop). */
  href?: string
  /** Escape hatch for a router-aware link, e.g. `<Link to="/categories" />` —
   *  cloned with this link's class and the rest of its props. */
  render?: ReactElement
  className?: string
}

export type LinkProps = DefaultProps & Omit<ComponentProps<'a'>, keyof DefaultProps>

/**
 * Inline text link — a plain sentence link, not a button or a nav item.
 *
 * Renders a plain `<a href>` by default. Pass `render` to swap in a
 * router-aware link instead (`react-router`'s `Link`, Next's `Link`, etc.) —
 * the design system itself has no router dependency.
 */
export const Link = ({
  children,
  href,
  render,
  className,
  ...rest
}: PropsWithChildren<LinkProps>) =>
  useRender({
    defaultTagName: 'a',
    render,
    props: {
      'data-part': 'root',
      className: cx('droppy-Link', className),
      // `href` is only included when there's no `render` override — a
      // present-but-`undefined` key would still spread onto the cloned
      // element and clobber whatever destination it computes on its own
      // (e.g. a router `Link`'s `to` prop).
      ...(render ? {} : { href }),
      children,
      ...rest,
    },
  })

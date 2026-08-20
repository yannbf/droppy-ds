import type { ComponentProps, PropsWithChildren, ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'

import { cx } from '../../utils/cx'

type DefaultProps = {
  href?: string
  render?: ReactElement
  className?: string
}

export type LinkProps = DefaultProps & Omit<ComponentProps<'a'>, keyof DefaultProps>

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

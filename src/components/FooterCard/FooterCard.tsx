import type { PropsWithChildren, ReactElement } from 'react'

import { Heading } from '../Heading'
import { Link } from '../Link'
import { cx } from '../../utils/cx'

export type FooterCardLink = {
  /** Visible label. Ignored when `render` supplies its own children. */
  name: string
  /** Destination for the default `<a>`. Ignored when `render` is set — the
   *  passed element owns its own destination (e.g. a router `to` prop). */
  href?: string
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean
  /** Escape hatch for a router-aware link, e.g. `<Link to="/categories" />` —
   *  cloned with this link's class and destination. */
  render?: ReactElement
}

export type FooterCardProps = {
  title: string
  links?: FooterCardLink[]
  className?: string
}

const FooterCardLinkItem = ({ name, href, external, render }: FooterCardLink) => (
  <li className="droppy-FooterCard-item">
    <Link
      href={href}
      render={render}
      className="droppy-FooterCard-link"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {name}
    </Link>
  </li>
)

/**
 * A titled list of links for a page footer — "Discover us", "Our social
 * media", or any other grouped column of footer navigation.
 *
 * Renders its links through `Link`, so a router-aware link can be swapped in
 * per item via `render` the same way `Breadcrumb` composes its crumbs.
 */
export const FooterCard = ({
  title,
  links = [],
  children,
  className,
}: PropsWithChildren<FooterCardProps>) => (
  <div className={cx('droppy-FooterCard', className)}>
    <Heading level={2} className="droppy-FooterCard-title">
      {title}
    </Heading>
    {links.length > 0 && (
      <ul className="droppy-FooterCard-list">
        {links.map((link) => (
          <FooterCardLinkItem key={link.name} {...link} />
        ))}
      </ul>
    )}
    {children}
  </div>
)

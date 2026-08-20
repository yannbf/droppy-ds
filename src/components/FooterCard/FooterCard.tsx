import type { PropsWithChildren, ReactElement } from 'react'

import { Heading } from '../Heading'
import { Link } from '../Link'
import { cx } from '../../utils/cx'

export type FooterCardLink = {
  name: string
  href?: string
  external?: boolean
  render?: ReactElement
}

export type FooterCardProps = {
  title: string
  links?: FooterCardLink[]
  className?: string
}

const FooterCardLinkItem = ({ name, href, external, render }: FooterCardLink) => (
  <li data-part="item" className="droppy-FooterCard-item">
    <Link
      data-part="link"
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

export const FooterCard = ({
  title,
  links = [],
  children,
  className,
}: PropsWithChildren<FooterCardProps>) => (
  <div data-part="root" className={cx('droppy-FooterCard', className)}>
    <Heading data-part="title" level={2} className="droppy-FooterCard-title">
      {title}
    </Heading>
    {links.length > 0 && (
      <ul data-part="list" className="droppy-FooterCard-list">
        {links.map((link) => (
          <FooterCardLinkItem key={link.name} {...link} />
        ))}
      </ul>
    )}
    {children}
  </div>
)

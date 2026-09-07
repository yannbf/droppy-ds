import type { ReactElement } from 'react'
import { useRender } from '@base-ui/react/use-render'

import { cx } from '../../utils/cx'

export type BreadcrumbItem = {
  label: string
  href?: string
  render?: ReactElement
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

const Crumb = ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => {
  const isLink = Boolean(item.href) || Boolean(item.render)

  return useRender({
    defaultTagName: isLink ? 'a' : 'span',
    render: item.render,
    props: {
      'data-part': isLink ? 'link' : 'text',
      className: isLink ? 'droppy-Breadcrumb-link' : 'droppy-Breadcrumb-text',
      href: item.render ? undefined : item.href,
      'aria-current': isLast ? 'page' : undefined,
      children: item.label,
    },
  })
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => (
  <nav data-part="root" aria-label="breadcrumb" className={cx('droppy-Breadcrumb', className)}>
    <ol data-part="list" className="droppy-Breadcrumb-list">
      {items.map((item, index) => (
        <li
          key={item.href ?? `${item.label}-${index}`}
          data-part="item"
          className="droppy-Breadcrumb-item"
        >
          <Crumb item={item} isLast={index === items.length - 1} />
          {index < items.length - 1 && (
            <span data-part="separator" className="droppy-Breadcrumb-separator" aria-hidden="true">
              /
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)

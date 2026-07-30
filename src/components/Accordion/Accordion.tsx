import type { ComponentProps, ReactNode } from 'react'
import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type AccordionItem = {
  /** Identifies this item in `value`/`defaultValue`/`onValueChange`. Falls back to the item's index. */
  value?: string
  /** Rendered inside the header trigger, alongside the expand/collapse icon. */
  title: ReactNode
  /** Rendered inside the panel when the item is open. */
  content: ReactNode
  disabled?: boolean
}

export type AccordionProps = {
  items: AccordionItem[]
  /** Allows more than one item to stay open at once. */
  openMultiple?: boolean
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  className?: string
}

/**
 * The plus/chevron icon the theme's `AccordionIcon` class rotates 45deg via
 * `[data-panel-open] > .AccordionIcon` — it must be a direct child of the
 * trigger for that selector to match.
 */
const PlusIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeLinecap="square"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M1.5 8h13M8 14.5v-13" />
  </svg>
)

/**
 * A stack of collapsible sections, each labelled by a header — an FAQ list,
 * a set of grouped filters, a details panel with several independent parts.
 *
 * Base UI's `Accordion` supplies the expand/collapse behaviour and the
 * animated panel height; this covers the common case of a static list of
 * items with a title and content each.
 */
export const Accordion = ({
  items,
  openMultiple,
  defaultValue,
  value,
  onValueChange,
  className,
}: AccordionProps) => (
  <BaseAccordion.Root
    className={cx(theme.AccordionRoot, 'droppy-Accordion', className)}
    multiple={openMultiple}
    defaultValue={defaultValue}
    value={value}
    onValueChange={onValueChange}
  >
    {items.map((item, index) => {
      const itemValue = item.value ?? String(index)

      return (
        <BaseAccordion.Item
          key={itemValue}
          value={itemValue}
          disabled={item.disabled}
          className={theme.AccordionItem}
        >
          <BaseAccordion.Header className={theme.AccordionHeader}>
            <BaseAccordion.Trigger className={theme.AccordionTrigger}>
              {item.title}
              <PlusIcon className={theme.AccordionIcon} />
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className={theme.AccordionPanel}>
            <div className={theme.AccordionContent}>{item.content}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      )
    })}
  </BaseAccordion.Root>
)

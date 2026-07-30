import type { ReactNode } from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type TabItem = {
  /** Identifies this tab in `value`/`defaultValue`/`onValueChange` and links it to its panel. */
  value: string
  /** Rendered inside the tab button. */
  label: ReactNode
  /** Rendered inside the panel when this tab is active. */
  content: ReactNode
  disabled?: boolean
}

export type TabsProps = {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

/**
 * A set of panels, one visible at a time, switched by a row of tab buttons —
 * settings sections, a profile's sub-views, anything reviewed one part at a
 * time rather than all at once.
 *
 * Base UI's `Tabs` supplies the roving focus, activation timing, and the
 * animated `Indicator` underline; this covers the common case of a static
 * list of tabs with a label and panel content each.
 */
export const Tabs = ({ tabs, defaultValue, value, onValueChange, className }: TabsProps) => (
  <BaseTabs.Root
    className={cx(theme.TabsRoot, 'droppy-Tabs', className)}
    defaultValue={defaultValue}
    value={value}
    onValueChange={onValueChange}
  >
    <BaseTabs.List className={theme.TabsList}>
      {tabs.map((tab) => (
        <BaseTabs.Tab
          key={tab.value}
          value={tab.value}
          disabled={tab.disabled}
          className={theme.TabsTab}
        >
          {tab.label}
        </BaseTabs.Tab>
      ))}
      <BaseTabs.Indicator className={theme.TabsIndicator} />
    </BaseTabs.List>
    <div className={theme.TabsPanelViewport}>
      {tabs.map((tab) => (
        <BaseTabs.Panel key={tab.value} value={tab.value} className={theme.TabsPanel}>
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </div>
  </BaseTabs.Root>
)

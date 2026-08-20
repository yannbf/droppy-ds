import type { ReactNode } from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import theme from '../../theme'

import { cx } from '../../utils/cx'

export type TabItem = {
  value: string
  label: ReactNode
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

export const Tabs = ({ tabs, defaultValue, value, onValueChange, className }: TabsProps) => (
  <BaseTabs.Root
    data-part="root"
    className={cx(theme.TabsRoot, 'droppy-Tabs', className)}
    defaultValue={defaultValue}
    value={value}
    onValueChange={onValueChange}
  >
    <BaseTabs.List data-part="list" className={theme.TabsList}>
      {tabs.map((tab) => (
        <BaseTabs.Tab
          key={tab.value}
          data-part="tab"
          value={tab.value}
          disabled={tab.disabled}
          className={theme.TabsTab}
        >
          {tab.label}
        </BaseTabs.Tab>
      ))}
      <BaseTabs.Indicator data-part="indicator" className={theme.TabsIndicator} />
    </BaseTabs.List>
    <div data-part="viewport" className={theme.TabsPanelViewport}>
      {tabs.map((tab) => (
        <BaseTabs.Panel
          key={tab.value}
          data-part="panel"
          value={tab.value}
          className={theme.TabsPanel}
        >
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </div>
  </BaseTabs.Root>
)

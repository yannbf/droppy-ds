import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { TabItem } from './Tabs'
import { Tabs } from './Tabs'

type Tab = TabItem & { label: string; content: string }

// A fixed-length tuple, not a plain array, so indexed access below doesn't
// need non-null assertions under `noUncheckedIndexedAccess`.
const tabs: readonly [Tab, Tab, Tab] = [
  { value: 'overview', label: 'Overview', content: 'Order stats and recent activity.' },
  { value: 'items', label: 'Items', content: 'Menu items and pricing.' },
  { value: 'settings', label: 'Settings', content: 'Store hours and preferences.' },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    tabs: [...tabs],
    defaultValue: 'overview',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    await expect(tab1).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByText(tabs[0].content)).toBeVisible()
  },
}

/** Clicking a tab activates it and swaps the visible panel. */
export const ClickToActivate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    await userEvent.click(tab2)

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(tab1).toHaveAttribute('aria-selected', 'false'))
    await waitFor(() => expect(canvas.getByText(tabs[1].content)).toBeVisible())
  },
}

/**
 * Tabs activates on click by default — moving focus with the arrow keys
 * alone does not change which panel is visible.
 */
export const KeyboardFocusDoesNotActivate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    tab1.focus()
    await expect(tab1).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')

    await waitFor(() => expect(tab2).toHaveFocus())
    await expect(tab2).toHaveAttribute('aria-selected', 'false')
    await expect(tab1).toHaveAttribute('aria-selected', 'true')

    await userEvent.click(tab2)
    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(canvas.getByText(tabs[1].content)).toBeVisible())
  },
}

/** A disabled tab stays focusable but never activates, by click or keyboard. */
export const DisabledTab: Story = {
  args: {
    tabs: [tabs[0], { ...tabs[1], disabled: true }, tabs[2]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const disabledTab = canvas.getByRole('tab', { name: 'Items' })

    disabledTab.focus()
    await expect(disabledTab).toHaveFocus()

    await userEvent.click(disabledTab)
    await expect(disabledTab).toHaveAttribute('aria-selected', 'false')
  },
}

/** External `value`/`onValueChange`, so the caller can drive which tab is active. */
export const ControlledValue: Story = {
  args: {
    defaultValue: undefined,
    value: 'items',
    onValueChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(canvas.getByText(tabs[1].content)).toBeVisible())
  },
}

/**
 * `Tabs.Indicator` writes the active tab's measured position as CSS custom
 * properties, which the module CSS transitions on top of — this asserts the
 * indicator's underlying value actually tracks the active tab.
 */
export const AnimatedIndicator: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const indicator = canvasElement.querySelector('.TabsIndicator') as HTMLElement

    await waitFor(() =>
      expect(indicator.style.getPropertyValue('--active-tab-width')).not.toBe(''),
    )
    const initialLeft = indicator.style.getPropertyValue('--active-tab-left')

    const tab3 = canvas.getByRole('tab', { name: 'Settings' })
    await userEvent.click(tab3)

    await waitFor(() => expect(tab3).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => {
      const nextLeft = indicator.style.getPropertyValue('--active-tab-left')
      expect(nextLeft).not.toBe(initialLeft)
    })
  },
}

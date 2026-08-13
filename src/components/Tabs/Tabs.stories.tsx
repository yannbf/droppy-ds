import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import type { TabItem, TabsProps } from './Tabs'
import { Tabs } from './Tabs'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TabsProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

type Tab = TabItem & { label: string; content: string }

// A fixed-length tuple, not a plain array, so indexed access below doesn't
// need non-null assertions under `noUncheckedIndexedAccess`.
const tabs: readonly [Tab, Tab, Tab] = [
  { value: 'overview', label: 'Overview', content: 'Order stats and recent activity.' },
  { value: 'items', label: 'Items', content: 'Menu items and pricing.' },
  { value: 'settings', label: 'Settings', content: 'Store hours and preferences.' },
]

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { tabs: [...tabs], defaultValue: 'overview' },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'The set, as `{ value, label, content, disabled? }`. Order is render order.',
    },
    defaultValue: {
      control: 'text',
      description: 'The tab active on first render, for an uncontrolled Tabs.',
    },
    value: {
      // Setting `value` from the panel would make Tabs controlled with nothing
      // driving it, freezing the active tab. ControlledValue shows the pairing.
      control: false,
      description: 'The active tab value, for a controlled Tabs. Pair with `onValueChange`.',
    },
    onValueChange: { description: 'Called with the newly active tab’s value.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Tabs` class.',
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A store's sub-views. The set and the starting tab are both set below, so the
 * controls start populated — edit the tabs or change which one opens first.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { tabs: [...tabs], defaultValue: 'overview', onValueChange: fn() },
  argTypes: hide('value', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `tabs` is the whole set — no `Tabs.Tab`/`Tabs.Panel` to compose by hand. */
export const TabsProp: Story = {
  name: 'tabs',
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange', 'className'),
  args: {
    tabs: [
      { value: 'food', label: 'Food', content: 'Burgers, sides, and mains.' },
      { value: 'drinks', label: 'Drinks', content: 'Soft drinks and juices.' },
    ],
    defaultValue: 'food',
  },
}

/** Item `disabled` keeps a tab focusable but never lets it activate. */
export const DisabledTab: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange', 'className'),
  args: { tabs: [tabs[0], { ...tabs[1], disabled: true }, tabs[2]] },
}

/** `defaultValue` picks the starting tab without making Tabs controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange', 'className'),
  args: { defaultValue: 'settings' },
}

/** `value` and `onValueChange` hand the active tab to the caller's state. */
export const ControlledValue: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('defaultValue', 'className'),
  args: { defaultValue: undefined, value: 'items', onValueChange: fn() },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange'),
  args: { className: 'tabs-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.tabs-demo-inset { margin: 1rem; }`}</style>
      <Tabs {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Tabs activate on click, not on focus: arrowing along the row moves focus
 * without swapping the panel, so a keyboard user can read the labels before
 * committing. Only Enter, Space, or a click activates.
 */
export const FocusDoesNotActivate: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'onValueChange', 'className'),
  play: async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })

    tab1.focus()
    await userEvent.keyboard('{ArrowRight}')
  },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * `Tabs.Indicator` writes the active tab's measured position and size to CSS
 * custom properties, which the theme transitions on top of — the sliding
 * underline. This asserts the mechanism, not the recipe: the variables really
 * do change when the active tab changes.
 */
export const AnimatedIndicator: Story = {
  tags: ['animation'],
  argTypes: hide('value', 'onValueChange', 'className'),
  play: async ({ canvas, canvasElement }) => {
    const indicator = canvasElement.querySelector('.TabsIndicator') as HTMLElement

    await waitFor(() => expect(indicator.style.getPropertyValue('--active-tab-width')).not.toBe(''))
    const initialLeft = indicator.style.getPropertyValue('--active-tab-left')

    const tab3 = canvas.getByRole('tab', { name: 'Settings' })
    await userEvent.click(tab3)

    await waitFor(() => expect(tab3).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() =>
      expect(indicator.style.getPropertyValue('--active-tab-left')).not.toBe(initialLeft)
    )
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The tab row, its indicator, and one panel per tab. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('tabs', 'defaultValue', 'value', 'onValueChange', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the active value and links tabs to panels.',
        },
        { id: 'list', name: 'List', description: 'The `role="tablist"` row.' },
        { id: 'tab', name: 'Tab', description: 'One button per entry, carrying `aria-selected`.' },
        {
          id: 'indicator',
          name: 'Indicator',
          description: 'The sliding underline; writes the active tab’s position as CSS variables.',
        },
        { id: 'viewport', name: 'Viewport', description: 'Wraps the panels.' },
        {
          id: 'panel',
          name: 'Panel',
          description: 'One per tab; only the active one is shown.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the
 * restaurant detail page stacks its menu sections vertically rather than
 * tabbing between them, which is the right call there and worth saying in the
 * story. The story to write is a DropBoard one: a partner's store view split
 * into 'Overview', 'Menu', and 'Settings' — the case where only one section is
 * relevant at a time, unlike a diner scrolling a whole menu.
 */
export const DropBoardStoreTabs: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestClickActivates: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    await userEvent.click(tab2)

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(tab1).toHaveAttribute('aria-selected', 'false'))
    await waitFor(() => expect(canvas.getByText(tabs[1].content)).toBeVisible())
  },
}

export const TestKeyboardFocusDoesNotActivate: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    tab1.focus()
    await userEvent.keyboard('{ArrowRight}')

    await waitFor(() => expect(tab2).toHaveFocus())
    await expect(tab2).toHaveAttribute('aria-selected', 'false')
    await expect(tab1).toHaveAttribute('aria-selected', 'true')
  },
}

export const TestDisabledTabNeverActivates: Story = {
  tags: ['tests'],
  args: { tabs: [tabs[0], { ...tabs[1], disabled: true }, tabs[2]] },
  play: async ({ canvas }) => {
    const disabled = canvas.getByRole('tab', { name: 'Items' })

    disabled.focus()
    await expect(disabled).toHaveFocus()

    await userEvent.click(disabled)
    await expect(disabled).toHaveAttribute('aria-selected', 'false')
  },
}

export const TestControlledValueHoldsItsTab: Story = {
  tags: ['tests'],
  args: { defaultValue: undefined, value: 'items', onValueChange: fn() },
  play: async ({ args, canvas }) => {
    const tab2 = canvas.getByRole('tab', { name: 'Items' })
    const tab3 = canvas.getByRole('tab', { name: 'Settings' })

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))

    await userEvent.click(tab3)

    // Controlled with no state behind it: the callback fires, the tab doesn't move.
    await expect(args.onValueChange).toHaveBeenCalledWith('settings', expect.anything())
    await expect(tab2).toHaveAttribute('aria-selected', 'true')
  },
}

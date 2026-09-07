import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import type { ButtonProps } from './Button'
import { Button } from './Button'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Order now', onClick: fn() },
  argTypes: {
    children: { control: 'text', description: 'The label. Omit it for an icon-only button.' },
    clear: { control: 'boolean', description: 'Strips the fill, leaving just the label.' },
    large: { control: 'boolean', description: 'Taller padding, for primary calls to action.' },
    round: {
      control: 'boolean',
      description: 'Fully rounded, for icon-only affordances like a close button.',
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
      description: 'Renders an icon before the label.',
    },
    iconSize: { control: 'number', description: 'Overrides the icon’s rendered size.' },
    disabled: { control: 'boolean', description: 'Blocks the click and dims the control.' },
    onClick: { description: 'Fired on click. Never fires while `disabled`.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Button` class.',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the label. Omitted, the button is icon-only and needs an `aria-label`. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'iconSize', 'className'),
  args: { children: 'Add to basket' },
}

/** `clear` strips the fill, for the secondary action beside a primary one. */
export const Clear: Story = {
  tags: ['api-ref'],
  argTypes: hide('large', 'round', 'icon', 'iconSize', 'className'),
  args: { clear: true, children: 'Not now' },
}

/** `large` adds height, for the one action a screen is really about. */
export const Large: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'round', 'icon', 'iconSize', 'className'),
  args: { large: true },
}

/** `round` fully rounds the control — pair it with an icon and no label. */
export const Round: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'iconSize', 'className'),
  args: { round: true, clear: true, icon: 'cross', children: undefined, 'aria-label': 'close' },
}

/** `icon` renders a glyph before the label, spaced with `gap` rather than a spacer node. */
export const IconProp: Story = {
  name: 'Icon',
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'iconSize', 'className'),
  args: { icon: 'cart' },
}

/** `iconSize` overrides the glyph size without touching the button's padding. */
export const IconSize: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button {...args} icon="cart" />
      <Button {...args} icon="cart" iconSize={32} />
    </div>
  ),
}

/** `disabled` dims the control and stops it firing `onClick`. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize', 'className'),
  args: { disabled: true },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize'),
  args: {
    className: 'button-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.button-demo-inset { margin: 1rem; }`}</style>
      <Button {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The control and its optional leading glyph. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'clear', 'large', 'round', 'icon', 'iconSize', 'className'),
  args: { icon: 'cart', children: 'Order now' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<button>`: fill, radius, focus ring, and the disabled state.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The optional leading glyph, spaced from the label with `gap`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

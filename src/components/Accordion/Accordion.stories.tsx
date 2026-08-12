import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { AccordionItem } from './Accordion'
import { Accordion } from './Accordion'

type Faq = AccordionItem & { value: string; title: string; content: string }

// A fixed-length tuple, not a plain array, so indexed access below doesn't
// need non-null assertions under `noUncheckedIndexedAccess`.
const faqItems: readonly [Faq, Faq, Faq] = [
  {
    value: 'what-is',
    title: 'What is Droppy?',
    content: 'Droppy is a design system for delivery and ordering products, built on Base UI.',
  },
  {
    value: 'get-started',
    title: 'How do I get started?',
    content: 'Install the package and import the components you need — no extra setup required.',
  },
  {
    value: 'theming',
    title: 'Can I customize the theme?',
    content: 'Yes — every part class is exposed by the theme layer and can be overridden.',
  },
]

const meta = {
  title: 'Layout & structure/Accordion',
  component: Accordion,
  args: {
    items: [...faqItems],
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
}

/** Single-open mode (the default): opening one item replaces whichever was open before. */
export const SingleOpen: Story = {
  tags: ['highlight'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const trigger1 = canvas.getByRole('button', { name: faqItems[0].title })
    const trigger2 = canvas.getByRole('button', { name: faqItems[1].title })

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(canvas.getByText(faqItems[0].content)).toBeVisible())

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Opening item 2 replaced item 1 — only one item is open at a time.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  },
}

/** `openMultiple` allows more than one panel to stay open simultaneously. */
export const OpenMultiple: Story = {
  tags: ['api-ref'],
  args: {
    openMultiple: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const trigger1 = canvas.getByRole('button', { name: faqItems[0].title })
    const trigger2 = canvas.getByRole('button', { name: faqItems[1].title })

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Both stay open at once under `openMultiple`.
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true')
  },
}

/** A disabled item stays focusable but never toggles open, by click or keyboard. */
export const DisabledItem: Story = {
  tags: ['api-ref'],
  args: {
    items: [faqItems[0], { ...faqItems[1], disabled: true }, faqItems[2]],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const disabledTrigger = canvas.getByRole('button', { name: faqItems[1].title })

    disabledTrigger.focus()
    await expect(disabledTrigger).toHaveFocus()

    await userEvent.click(disabledTrigger)
    await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(faqItems[1].content)).not.toBeInTheDocument()
  },
}

/** External `value`/`onValueChange`, so the caller can drive which item is open. */
export const ControlledValue: Story = {
  tags: ['api-ref'],
  args: {
    value: ['what-is'],
    onValueChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger1 = canvas.getByRole('button', { name: faqItems[0].title })

    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(canvas.getByText(faqItems[0].content)).toBeVisible())
  },
}

/**
 * No arrow-key navigation between headers by design (Base UI's Accordion
 * removed roving focus to match the current W3C APG pattern) — only Tab
 * order moves focus between triggers, and Space toggles the focused one.
 */
export const KeyboardTabFlow: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger1 = canvas.getByRole('button', { name: faqItems[0].title })
    const trigger2 = canvas.getByRole('button', { name: faqItems[1].title })

    trigger1.focus()
    await expect(trigger1).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(trigger1).toHaveFocus()
    await expect(trigger2).not.toHaveFocus()

    await userEvent.tab()
    await waitFor(() => expect(trigger2).toHaveFocus())

    await userEvent.keyboard(' ')
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
  },
}

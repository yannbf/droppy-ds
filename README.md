# @droppy/design-system

React components for the Droppy design language, built on [Base UI](https://base-ui.com).

Base UI supplies the behaviour — focus management, dismissal, positioning, ARIA wiring.
[`@droppy/theme`](https://github.com/storybook-tmp/base-ui/tree/master/packages/droppy) supplies
the tokens and the chrome. This package is the layer on top: components with props instead of
class names, so consuming code says `<Button clear round icon="cross" />` rather than binding
theme classes at every call site.

## Install

```bash
npm install "@droppy/design-system@https://pkg.pr.new/yannbf/droppy-ds/@droppy/design-system@<sha>"
```

Every commit publishes a build through [pkg.pr.new](https://pkg.pr.new); take the SHA from the
commit you want. `@base-ui/react` and `react` are peer dependencies — install them alongside.

## Use

Import the stylesheet once, in your app entry:

```tsx
import '@droppy/design-system/styles.css'
```

It carries the Droppy tokens and every component's styles. Then import components anywhere:

```tsx
import { Button, Input, Modal } from '@droppy/design-system'

export const RemoveItem = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Input label="Reason" />
    <Button large>Remove</Button>
  </Modal>
)
```

## Components

| Component    | Built on                 | For                                                  |
| ------------ | ------------------------ | ---------------------------------------------------- |
| `Button`     | `Base UI Button`         | Primary and secondary actions                        |
| `IconButton` | `Base UI Button`         | Floating icon-only affordances — carousel arrows     |
| `Icon`       | —                        | The icon set, inlined                                |
| `Heading`    | —                        | Display type, `h1`–`h5`                              |
| `Input`      | `Base UI Field`, `Input` | Labelled text fields with a reserved error slot      |
| `Select`     | native `select`          | A single choice from a short, known list             |
| `Modal`      | `Base UI Dialog`         | A decision that blocks the page                      |
| `Sidebar`    | `Base UI Drawer`         | A panel reviewed alongside the page — carts, filters |
| `Tooltip`    | `Base UI Tooltip`        | A hint for a control whose face doesn't explain it   |

Run `pnpm storybook` for the props, the variants and what each one looks like in both themes.

## Dark mode

Set `data-theme="dark"` on the root element. Unset, the tokens follow the OS preference.

```tsx
document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
```

## Styling from the outside

Every component merges an incoming `className` rather than replacing its own, so wrapping one
in `styled()` or adding utility classes composes instead of stripping the design system's
styling.

The cascade is ordered: theme rules first, component rules second, and anything the app writes
last. App CSS wins at equal specificity without `!important`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

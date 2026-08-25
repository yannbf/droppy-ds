# @droppy-ui/design-system

React components for the Droppy design language, built on [Base UI](https://base-ui.com).

Base UI supplies the behaviour — focus management, dismissal, positioning, ARIA wiring. This
package ships its own theme — the design tokens and the chrome — plus a component layer on top:
components with props instead of class names, so consuming code says
`<Button clear round icon="cross" />` rather than binding theme classes at every call site.

## Install

```bash
npm install @droppy-ui/design-system
```

`react` and `react-dom` are peer dependencies — install them alongside. Base UI is bundled
inside the package, so it never needs to be installed separately.

## Use

Import the stylesheet once, in your app entry:

```tsx
import '@droppy-ui/design-system/styles.css'
```

It carries the Droppy tokens and every component's styles. Then import components anywhere:

```tsx
import { Button, Input, Modal } from '@droppy-ui/design-system'

export const RemoveItem = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Input label="Reason" />
    <Button large>Remove</Button>
  </Modal>
)
```

## Components

| Component         | Built on                  | For                                                       |
| ----------------- | ------------------------- | --------------------------------------------------------- |
| `Button`          | `Base UI Button`          | Primary and secondary actions                             |
| `IconButton`      | `Base UI Button`          | Floating icon-only affordances — carousel arrows          |
| `Link`            | `Base UI useRender`       | Inline text links — a plain sentence link, not a button   |
| `Icon`            | —                         | The icon set, inlined                                     |
| `Heading`         | —                         | Display type, `h1`–`h5`, with `size` decoupled from level |
| `Body`            | —                         | Body copy — `p` by default, or `span`, `label`            |
| `Badge`           | —                         | Short inline status labels                                |
| `Review`          | —                         | A star rating with a text line — "★ 4.5 Very good"        |
| `Input`           | `Base UI Field`, `Input`  | Labelled text fields with a reserved error slot           |
| `Select`          | native `select`           | A single choice from a short, known list                  |
| `NumberField`     | `Base UI NumberField`     | A typeable number with stepper buttons and pointer scrub  |
| `QuantityStepper` | —                         | A minus/plus pair flanking a single item's count          |
| `Modal`           | `Base UI Dialog`          | A decision that blocks the page                           |
| `Sidebar`         | `Base UI Drawer`          | A panel reviewed alongside the page — carts, filters      |
| `Tooltip`         | `Base UI Tooltip`         | A hint for a control whose face doesn't explain it        |
| `Toast`           | `Base UI Toast`           | Transient, self-dismissing corner notifications           |
| `Accordion`       | `Base UI Accordion`       | Independently collapsible sections — FAQs, filter groups  |
| `Tabs`            | `Base UI Tabs`            | Panels shown one at a time, switched by a row of tabs     |
| `Skeleton`        | —                         | A loading placeholder for content not yet known           |
| `Spinner`         | —                         | An indeterminate loading indicator                        |
| `ProgressBar`     | —                         | Progress through a known number of steps                  |
| `Progress`        | `Base UI Progress`        | A progress fill with a label and formatted value          |
| `ErrorBlock`      | —                         | A titled message with one recovery action — 404s, errors  |
| `TopBanner`       | —                         | A page-top banner: a title over an optional photo         |
| `Breadcrumb`      | `Base UI useRender`       | A trail of ancestor pages leading to the current one      |
| `Carousel`        | —                         | A horizontally scrolling row with drag, wheel and arrows  |
| `ScrollArea`      | `Base UI ScrollArea`      | A scrollable panel with a themed, hover-revealed scrollbar |
| `Separator`       | `Base UI Separator`       | A divider between two blocks of content                   |
| `Container`       | —                         | The centered max-width wrapper for page content           |
| `PageSection`     | —                         | A titled slice of a page with an optional top action      |
| `PageTemplate`    | —                         | The page shell: header, `<main>`, footer                  |
| `FooterCard`      | —                         | A grouped column of footer links                          |
| `Card`            | —                         | A themed surface for grouped content                      |

Run `pnpm storybook` in this repo for the props, the variants and what each one looks like in
both themes.

## Dark mode

Set `data-ds-theme="dark"` on the root element. Unset, the tokens follow the OS preference.

```tsx
document.documentElement.dataset.dsTheme = isDark ? 'dark' : 'light'
```

## Styling from the outside

Every component merges an incoming `className` rather than replacing its own, so wrapping one
in `styled()` or adding utility classes composes instead of stripping the design system's
styling.

The cascade is ordered: theme rules first, component rules second, and anything the app writes
last. App CSS wins at equal specificity without `!important`.

## Experiment branches

`experiment/*` branches each hold one subset of the Storybook corpus, for measuring what a given
kind of documentation is worth to an agent. See
[tools/storybook-freeze](./tools/storybook-freeze/README.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

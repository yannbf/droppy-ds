# @droppy/design-system

React components for the Droppy design language, built on [Base UI](https://base-ui.com).

Base UI supplies the behaviour — focus management, dismissal, positioning, ARIA wiring. This
package ships its own theme — the design tokens and the chrome — plus a component layer on top:
components with props instead of class names, so consuming code says
`<Button clear round icon="cross" />` rather than binding theme classes at every call site.

## Install

```bash
npm install "@droppy/design-system@https://pkg.pr.new/yannbf/droppy-ds/@droppy/design-system@<sha>"
```

Every commit publishes a build through [pkg.pr.new](https://pkg.pr.new); take the SHA from the
commit you want. `react` and `react-dom` are peer dependencies — install them alongside. Base UI
is bundled inside the package, so it never needs to be installed separately.

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

Set `data-ds-theme="dark"` on the root element. Unset, the tokens follow the OS preference.

```tsx
document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
```

## Styling from the outside

Every component merges an incoming `className` rather than replacing its own, so wrapping one
in `styled()` or adding utility classes composes instead of stripping the design system's
styling.

The cascade is ordered: theme rules first, component rules second, and anything the app writes
last. App CSS wins at equal specificity without `!important`.

## Experiment branches

`experiment/*` branches each hold one subset of the Storybook corpus, for measuring what a given
kind of documentation is worth to an agent.

```bash
pnpm experiment:freeze             # regenerate every branch in experiments.config.ts
pnpm experiment:publish-branches   # force-push them to origin
```

Facets are the qualified `category.leaf` labels in `classification-labels.jsonc`; each branch's
selection lives in `experiments.config.ts` and is recorded in the `experiment.json` the freeze
commits. Freezing reads the classification on the branch you run it from — story `tags`, MDX
`{/* BEGIN: facet */}` markers, and the `<Meta tags>` on the repo-wide docs.

Each pushed branch triggers the Storybook MCP preview workflow, which publishes that branch's
Storybook manifests as an installable `@droppy/mcp` server on pkg.pr.new:

```
https://pkg.pr.new/yannbf/droppy-ds/@droppy/mcp@experiment/<name>
```

Serving that package is what makes a branch's facet selection observable: the library build is
the same on every branch, so the documentation only differs through the MCP. See
[apps/mcp-server](./apps/mcp-server/README.md) for how to run one.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

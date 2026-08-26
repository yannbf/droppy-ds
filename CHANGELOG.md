# @droppy-ui/design-system

## 0.3.0

### Minor Changes

- 42e1afc: TopBanner: the title's heading level is now a `level` prop, defaulting to `h1` (it was hard-coded to `h2`). The default matches the component's job as a page's header band — the outline starts at the banner — and restores the semantics of the Mealdrop component it replaced. Pass `level={2}` to keep the previous rendering where a page's `h1` lives elsewhere.

## 0.2.0

### Minor Changes

- c1dfe65: Base UI is now bundled into the package instead of being loaded from the consumer's `node_modules`. `@base-ui/react` is no longer a peer dependency — remove it from your project's dependencies. `react` and `react-dom` remain the only peers.
- 8790c84: Initial component set: Button, IconButton, Icon, Heading, Input, Select, Modal, Sidebar and Tooltip.
- 4a2c0c7: The theme now ships inside the package — design tokens and Base UI part chrome live in `src/theme`, and the `@droppy/theme` dependency is gone.
- 4a2c0c7: Add Body, Badge, Card, and Skeleton, and give Heading an optional `size` prop that decouples visual scale from the semantic level.
- 4b20c0e: Add Container, PageSection, TopBanner, ErrorBlock, Spinner, ProgressBar, Breadcrumb, and QuantityStepper.

### Patch Changes

- fb72a87: Ship `use-sync-external-store` as a regular dependency instead of bundling it: bundled, its CJS `require("react")` survived into the published output and threw at runtime in browser builds that load the package as ESM.
- f9c7052: Fix the `positive` Badge variant rendering white text on its pale green background in dark mode. The text color token stayed tied to the page-level text color, which flips to white in dark mode, while the background token stays the same pale green in both themes — the two no longer matched. The text color is now pinned to the same dark neutral in both themes.
- 4244097: Fix Spinner's static arc rendering outside the viewBox, Skeleton flashing transparent under a `background-repeat: no-repeat` reset, Select's chevron and clearance staying full-size on compact controls, and IconButton's icon ignoring the dark theme.
- e582a34: FooterCard's on-dark text color is now documented as an intentional design decision, not an implementation detail consumers had to rediscover and restate. The component already set `--ds-color-text-on-inverse` on its root; the docs now state the dark-footer assumption directly, and the stories decorator renders against the canonical `--ds-color-surface-inverse` token instead of a hardcoded color, so the contrast claim is demonstrable.
- c99d5bf: Shrink Select's chevron to text proportion: a 1em mask box (~14×8px arrow at the default size) with 2em reserved clearance, replacing the 1.5em box and 2.5em clearance that dominated compact controls.

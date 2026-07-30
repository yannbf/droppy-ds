# Mealdrop parity

These components started as Mealdrop's, migrated to Base UI in
[mealdrop#63](https://github.com/yannbf/mealdrop/pull/63). Props are unchanged, so swapping
Mealdrop's local components for these is an import change. Rendering differs in the ways below.

Each entry is deliberate. A design system that reproduces an app's workarounds isn't a design
system, and the app-specific pieces belong to the app.

## Behaviour

**`Modal` and `Sidebar` take a `container` prop.** Mealdrop portalled into `#modal` — an element
in its own `index.html`. A package can't assume that node exists, so the container is a prop
accepting an element or a selector, defaulting to `document.body`. Mealdrop passes
`container="#modal"`.

**`Select` returns strings for non-numeric options.** Mealdrop ran every value through
`Number()`, so text options arrived as `NaN`. Numeric options still arrive as numbers.

**`Input` no longer sets `aria-label`.** Base UI's `Field` associates the label with the control,
and an `aria-label` on top of a real `<label>` overrides the visible text — a mismatch between
what a screen reader announces and what the page shows. Removing it lets them agree.

**`Button` spaces its icon with `gap`, not a spacer element.** One fewer DOM node; same 1rem.

**`Skeleton` needs no `SkeletonTheme` wrapper.** Mealdrop themed `react-loading-skeleton`
through a `<SkeletonTheme color highlightColor>` wrapper reading its styled-components theme.
Droppy's `Skeleton` reads the skeleton tokens directly, so the swap deletes the wrapper and the
library dependency along with it.

**`Badge` absorbs `RestaurantCard`'s hand-rolled `NewTag`.** Mealdrop had two implementations
of the same visual role; the green one is now `variant="positive"`. The variant carries the
colours and weight only — `NewTag`'s absolute positioning belongs to the call site.

**`Heading` takes a `size` prop.** Mealdrop wrapped `Heading` in `styled()` at four call sites
to force a smaller visual size on a correctly-levelled heading. `size` does that directly:
`level` picks the tag, `size` (defaulting to `level`) picks the scale.

**`Card` replaces the inline card shells.** Background, radius, shadow and the hover dim were
reimplemented per component (`RestaurantCard`, `Category`, `FoodItem`, `OrderSummary`); the
shell is one component now, and the domain content composes inside it.

**`Container` replaces the global `.container` classes.** Mealdrop styled page width with
`.container`/`.container-desktop` in its global stylesheet; the component's `desktopOnly` prop
covers the second class, named for what it does rather than for the old suffix.

**`ErrorBlock`'s `image` prop is `illustration`, and optional.** The Lottie player and its
animation JSON are application assets; the slot takes any node, or nothing.

**`Spinner` carries a real accessible name.** Mealdrop's spinner had an off-canvas SVG `<text>`
that nothing announced. The component is `role="status"` with an `aria-label` from its `label`
prop, and the spin is CSS keyframes so `prefers-reduced-motion` slows it to stay perceivable
without strobing.

**`Breadcrumb` drops the router import and gains landmark semantics.** Crumbs are
`{ label, href? }` items rendered as plain `<a>` inside `<nav aria-label="breadcrumb">` with
`aria-current="page"` on the last one; a per-item `render` prop is the escape hatch for a
router-aware link. Mealdrop rendered `div`/`p` with `react-router-dom`'s `Link` baked in.

**`QuantityStepper` is a component, not an inline pattern.** The minus/plus pair from
`FoodItemModal` with the same labels and bounds behavior, plus `role="group"` and a politely
announced value, which the inline version lacked.

**`TopBanner.onBackClick` is accepted but unwired.** Mealdrop's own back button is commented
out; the prop stays for call-site parity until one of us puts the button back.

**`Select` puts its label before the control in the DOM.** It was after, so a sibling selector
could drive the focus highlight. `:has()` does that now, and the reading order matches the
visual order.

## Appearance

**The `Select` chevron follows the theme.** It was a data-URL SVG with the arrow colour baked
into the XML, which meant it needed a JavaScript theme lookup to flip for dark mode — custom
properties don't resolve inside an embedded SVG. It's a mask over a token-coloured layer now, so
it flips in CSS.

**`ErrorBlock`'s inner gap is `--ds-space-sm` (24px), was 20px.** Mealdrop's `spacing.m` has no
exact token; the scale is the source of truth for spacing, same as for type sizes below.

**`Breadcrumb`'s plain crumb is `--ds-type-weight-regular`, was `font-weight: lighter`.** The
body face ships no lighter cut, so the keyword resolved to regular at render time anyway.

**The `Input` error message is `--ds-type-size-2xs` (11.52px), was 12px.** A 0.48px difference,
visible only to pixel comparison. The scale is the source of truth for type sizes.

**`Heading` level 5 has a size.** Mealdrop's type scale stopped at level 4, so `level={5}`
rendered an `h5` with no size rule and inherited whatever surrounded it.

**Colours that were styled-components theme lookups are now tokens.** The mapping is exact in
both light and dark:

| Mealdrop        | Droppy                       |
| --------------- | ---------------------------- |
| `overlayHeader` | `--ds-color-surface-sunken`  |
| `sidebarFooter` | `--ds-color-surface-overlay` |
| `headerBorder`  | `--ds-color-border-subtle`   |
| `inputIcon`     | `--ds-color-icon-default`    |

## Not included

**`Header`.** Routing, cart state and a logo — an application component. Its tooltip is here as
`Tooltip`.

**`IconButton` stays light in dark mode.** Carried over deliberately: it sits on photography, not
on a themed surface. It is the one component in the set that doesn't respond to the theme.

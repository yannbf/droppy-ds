# Contributing

## Setup

```bash
pnpm install
pnpm storybook
```

Storybook is the development environment. There is no separate demo app.

## Checks

```bash
pnpm check   # types
pnpm lint    # eslint
pnpm test    # every story, in a real browser
pnpm build   # the published artefact
```

All four run in CI on every pull request.

## Adding a component

1. `src/components/<Name>/` with `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx` and `index.ts`.
2. Add the stylesheet to `src/styles/index.css` — components never import their own CSS, so the
   JS stays side-effect free and tree-shakes.
3. Export it from `src/index.ts`.
4. Add a changeset: `pnpm changeset`.

## How components are built

**Behaviour comes from Base UI.** Focus traps, dismissal, positioning, ARIA relationships — if
Base UI has a primitive for it, use it rather than reimplementing. Hand-rolled overlays are how
keyboard and screen-reader support goes missing.

**Chrome comes from the theme layer** in `src/theme`. Bind its classes (`theme.DialogPopup`) for
surface, radius, colour and motion. This package's own CSS covers layout, variants and
composition — the things a theme can't know.

**Values come from tokens.** Reach for `var(--ds-*)` before a literal. A hard-coded colour won't
follow the theme into dark mode; a hard-coded size drifts from the scale. When a token genuinely
doesn't fit, say why in a comment.

**Class names are `droppy-<Component>` and `droppy-<Component>--<modifier>`**, with parts as
`droppy-<Component>-<part>`.

**`className` merges, never replaces.** Use `cx()` from `src/utils/cx` so consumers can compose.

## Testing

Stories are the tests. Every story runs in a real browser, play functions run as interaction
tests, and accessibility violations fail the run (`a11y: { test: 'error' }` in
`.storybook/preview.tsx`). A component with a behaviour worth keeping gets a story with a play
function that asserts it.

## Releasing

Releases go through [changesets](https://github.com/changesets/changesets). A PR that changes
the package ships a changeset (`pnpm changeset`). On merge to `main`, the release workflow opens
or updates a "Version packages" PR aggregating the pending changesets; merging that PR builds
and publishes `@droppy-ui/design-system` to npm via trusted publishing — no token, no manual
step.

`pkg.pr.new` still publishes a build for every commit, so unreleased work is installable from
a SHA:

```bash
npm install "@droppy-ui/design-system@https://pkg.pr.new/yannbf/droppy-ds/@droppy-ui/design-system@<sha>"
```

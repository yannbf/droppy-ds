---
name: component-docs
description: Standards for droppy-ds component documentation — MDX facet structure, decision logs, known issues, and the GitHub issue format. Use when creating a new component, changing an existing component's code or behavior, writing or editing any *.mdx component page, or resolving a tracked issue. Docs must be updated in the same change as the code.
---

# Component documentation standard

Every component lives in `src/components/<Name>/` as five files: `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx`, `<Name>.mdx`, `index.ts`. The MDX page is not an afterthought — it is part of the component's contract, and a code change that makes the page stale is an incomplete change.

Use an existing page as the exemplar before writing one: `src/components/Tabs/Tabs.mdx` (Base UI-backed) or `src/components/Card/Card.mdx` (plain element).

## MDX facet structure

Every page is divided into fenced facets, in this exact order, each wrapped in
`{/* BEGIN: <facet> */}` … `{/* END: <facet> */}` markers. Keep empty facets present with their markers — tooling relies on them.

| Facet | Content |
| --- | --- |
| `general` | One-sentence intro, `import` snippet in a `tsx` fence, `<Canvas of={Stories.Default} />`, `## Features` bullets |
| `when-to-use` | `## When to use` and `## When not to use`, with links to the alternatives |
| `behavior` | `## How it works` — one `###` per behavior, each with a Canvas |
| `anatomy` | `## Anatomy` — Canvas plus a table: Part, `data-part`, Renders, Purpose |
| `examples` | Optional composed examples |
| `do-dont` | Optional do/don't pairs |
| `a11y` | `## Keyboard & screen reader` — key table (if interactive), then **ARIA** / **Screen reader** / **You must provide** bullets |
| `brand` | Brand-specific notes, when the component embodies a brand rule |
| `styling` | `## Styling` — token table, plus the `className`-merge contract |
| `props` | `## API reference` — `<ArgTypes />` then one `###` per prop with a Canvas |
| `history` | `## Decision log` — see below |
| `known-issues` | `## Known issues & open questions` — see below |

## Decision log rules

- Dated bullets, `- **YYYY-MM**: …`, oldest first. The final bullet is the **Built on …** line stating what the component is built on.
- Record **Droppy's decisions only** — never the upstream primitive's own history (no "Base UI decided…"), and no inventories of what a primitive supplies. If the decision was made by Base UI, it does not belong here.
- Usable citations: pre-Droppy Mealdrop commits (`yannbf/mealdrop`), droppy-ds commits and PRs, the [parity doc](../../docs/MEALDROP-PARITY.md). Never cite transient agentic work: wave commits, Mealdrop's Droppy-adoption PRs, coverage percentages.
- Brand claims must be anchored in Droppy's own docs — the Brand guidelines page (`?path=/docs/brand-guidelines--docs`) or the Design tokens pages — quoting their actual wording. If a rule is not codified there, state the decision plainly without a quote.
- Keep resolution narratives concise: state the outcome ("removed in [droppy-ds #16], closing [#10]"), not the intermediate attempts — unless a rejection *is* the current state.

## Known issues rules

- Every bullet references a real GitHub issue:
  `- [#N](https://github.com/yannbf/droppy-ds/issues/N): one-sentence defect. **Workaround:** how to cope.`
- Qualified workarounds use `**Workaround** (partial):` / `(fragile):` / `(hacky):`. No workaround → plain prose: `No workaround — <why>.`
- No status tags — never "(open)", "systemic", or similar.
- A new finding gets an issue **filed first** (format below), then referenced. Never leave a finding in the docs without an issue.
- Include the repo's systemic issues where they genuinely apply — verify in source, don't copy blindly:
  - [#125](https://github.com/yannbf/droppy-ds/issues/125) closed prop surface (no `...rest` spread / no `HTMLAttributes` extension)
  - [#122](https://github.com/yannbf/droppy-ds/issues/122) no `forwardRef` — only when the props type actually accepts `ref`
  - [#129](https://github.com/yannbf/droppy-ds/issues/129) box-shadow-only focus ring — only when the component has focusable parts
  - [#138](https://github.com/yannbf/droppy-ds/issues/138) unnamespaced theme classes — only when it uses the theme layer's bare class names

## GitHub issue format

- Title: `[Component] one-sentence defect statement`.
- Body sections, in order: `## What happens` (mechanism, consequences), `## Minimal reproduction` (a runnable `jsx` fence), `## Expected behaviour`, `## Evidence` (repo-relative `file:line` bullets), `## Workaround` ("Yes. …" / "None …").
- Labels from the existing set: `bug`, `documentation`, `enhancement`, `accessibility`, `edge-case`, `question`.
- Verify every Evidence line against the actual source before filing. Do not speculate.

## When changing an existing component

- **Fixing a tracked issue**: remove its known-issues bullet, close the issue (the PR should say `closes #N`), and if the fix embodies a decision worth remembering, add a dated decision-log entry recording the outcome.
- **Behavior or API change**: add a dated decision-log entry with the *why*, and update every affected facet — Features, behavior, a11y, styling token table, props.
- **New defect noticed while working**: file an issue in the format above and add the bullet, even if you don't fix it.
- **Docs claims must track reality**: if the code no longer does what a facet says, the facet changes in the same commit.

## Verification

- `pnpm build-storybook` must pass (catches MDX compile errors).
- `pnpm check`, `pnpm lint`, and `pnpm test:ci` must pass.
- Click-check any `?path=/docs/...` links you add against a running Storybook — the slugs derive from `Meta` titles and break silently when pages move.

## Keeping this standard current

This file states point-in-time facts, and stale instructions are worse than none — **whenever your change invalidates a fact written here, update this file (and AGENTS.md) in the same PR**. Do not wait to be asked. Concretely:

- **Systemic issues**: the #122/#125/#129/#138 list above is only valid while those issues are open. Before citing one, verify it (`gh issue view <n> --repo yannbf/droppy-ds`). If you fix a systemic issue: remove it from the list above, sweep every component MDX for known-issues bullets referencing it (`grep -rn "issues/<n>" src/components --include="*.mdx"`) and delete them, and record the fix where it's decision-log-worthy. The same sweep applies to any tracked issue you close.
- **Facet structure**: if facets are added, removed, or reordered, update the facet table above and confirm the exemplar pages still match.
- **Exemplars**: if `Tabs.mdx` or `Card.mdx` stop being representative (restructured, deprecated), point to better ones.
- **Formats and labels**: if the issue template or the label set changes in practice, this file follows the practice — align it with what the most recently filed issues actually look like.
- **Commands**: if `package.json` scripts are renamed, fix the Verification section here and the gate in AGENTS.md.

If you notice this file already disagrees with reality mid-task (a referenced issue is closed, a path moved, a facet renamed), fix the file as part of your change even when the drift isn't yours.

# AGENTS.md

Instructions for AI agents working in this repository — fixing bugs, creating components, or editing docs. Droppy is the design system of Mealdrop Corp; its Storybook is the product, so documentation quality is held to the same bar as code.

## Before you start

1. **Read the guidelines relevant to your change.** They are the source of truth, not suggestions:
   - [src/docs/BrandGuidelines.mdx](src/docs/BrandGuidelines.mdx) — brand rules (color roles, typography, voice, motion). Brand claims in code or docs must anchor here.
   - [src/docs/AccessibilityGuidelines.mdx](src/docs/AccessibilityGuidelines.mdx) and [src/docs/TechnicalGuidelines.mdx](src/docs/TechnicalGuidelines.mdx)
   - [src/docs/ChoosingComponents.mdx](src/docs/ChoosingComponents.mdx) — before adding a component, check whether an existing one covers the need.
2. **Use the Storybook MCP.** This repo ships `@storybook/addon-mcp`. Start Storybook with `pnpm storybook` (or the `storybook` entry in `.claude/launch.json`) and connect to its MCP endpoint to list components and stories, verify stories render, and drive the dev loop. Prefer it over guessing at story state from source.
3. Tokens are generated: edit `src/theme/tokens/*.json` (built by `terrazzo`), never the generated `src/theme/tokens.css` directly.

## Creating a new component

Follow the **component-docs standard** in [.claude/skills/component-docs/SKILL.md](.claude/skills/component-docs/SKILL.md). Claude Code agents: invoke the `component-docs` skill before writing any component or MDX file. Other agents: read that file and follow it — it is the normative spec.

Non-negotiables, summarized:

- Five files in `src/components/<Name>/`: component, CSS, stories, MDX, index. Match an exemplar page (`Tabs.mdx`, `Card.mdx`) structurally — the MDX facet order and `{/* BEGIN/END */}` markers are load-bearing.
- Every prop gets an `ArgTypes` entry, a `###` section, and a story. Every behavior claim in the docs has a story demonstrating it.
- The `history` facet records the component's real origin and decisions (with commit links); the `known-issues` facet lists honest, issue-tracked defects — a new component audited to zero findings is more suspicious than one with five.
- Styling reads design tokens; classes are `droppy-<Name>` namespaced; `className` merges rather than replaces.

## Changing an existing component

**The MDX page must stay true in the same change.** Specifically:

- Fixed a tracked issue? Remove its bullet from `## Known issues & open questions`, close the issue (`closes #N` in the PR), and record a notable outcome as a dated `## Decision log` entry.
- Changed behavior or API? Add a dated decision-log entry with the reasoning, and update every facet the change touches (Features, How it works, a11y, Styling tokens, props).
- Found a new defect you aren't fixing? File a GitHub issue in the repo's format (see the skill) and reference it as a known-issues bullet. Never leave findings untracked.
- Decision logs record decisions Droppy made — not upstream library history, and never transient agent artifacts (wave commits, adoption PRs).

## Verification before you're done

```bash
pnpm check && pnpm lint && pnpm test:ci && pnpm build-storybook
```

All four must pass. Visual changes additionally go through Chromatic on CI — expect and review snapshot diffs rather than avoiding them.

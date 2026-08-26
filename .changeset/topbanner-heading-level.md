---
'@droppy-ui/design-system': minor
---

TopBanner: the title's heading level is now a `level` prop, defaulting to `h1` (it was hard-coded to `h2`). The default matches the component's job as a page's header band — the outline starts at the banner — and restores the semantics of the Mealdrop component it replaced. Pass `level={2}` to keep the previous rendering where a page's `h1` lives elsewhere.

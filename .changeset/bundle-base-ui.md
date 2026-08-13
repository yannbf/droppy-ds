---
'@droppy/design-system': minor
---

Base UI is now bundled into the package instead of being loaded from the consumer's `node_modules`. `@base-ui/react` is no longer a peer dependency — remove it from your project's dependencies. `react` and `react-dom` remain the only peers.

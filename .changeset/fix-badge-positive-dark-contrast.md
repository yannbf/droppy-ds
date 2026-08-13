---
'@droppy/design-system': patch
---

Fix the `positive` Badge variant rendering white text on its pale green background in dark mode. The text color token stayed tied to the page-level text color, which flips to white in dark mode, while the background token stays the same pale green in both themes — the two no longer matched. The text color is now pinned to the same dark neutral in both themes.

---
'@droppy-ui/design-system': patch
---

Ship `use-sync-external-store` as a regular dependency instead of bundling it: bundled, its CJS `require("react")` survived into the published output and threw at runtime in browser builds that load the package as ESM.

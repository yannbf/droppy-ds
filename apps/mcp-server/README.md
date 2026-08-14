# @droppy/mcp

A self-contained Storybook MCP server for Droppy: `@storybook/mcp` bundled into a single
Node CLI, with the Storybook build's MCP manifests baked into the package. It exists so
agentic reference experiments can serve the design-system MCP locally — one private
server per run — instead of depending on a shared hosted endpoint.

## Published previews

`.github/workflows/storybook-mcp-preview.yml` builds the Storybook and publishes this
package to [pkg.pr.new](https://pkg.pr.new) on every push to an `experiment/*` branch.
Each branch keeps a different selection of documentation facets (see
`experiments.config.ts`), so each branch's package serves exactly the documentation that
branch kept. Every package carries a branch-derived version
(`0.0.0-<branch-slug>.<short-sha>`) and a `provenance.json` recording the repo, branch and
sha its manifests were built from.

Install URLs (long form; the package is not on npm):

```bash
# By commit sha (immutable — use this for pinned experiment runs)
npm i https://pkg.pr.new/yannbf/droppy-ds/@droppy/mcp@<sha>

# By branch name (mutable — resolves to the branch's latest published commit)
npm i https://pkg.pr.new/yannbf/droppy-ds/@droppy/mcp@experiment/empty
```

The tarball is self-contained: extracting it and running `node package/dist/cli.js` works
without an `npm install`.

## Usage

```bash
droppy-mcp [--host 127.0.0.1] [--port 6006] [--manifests <dir>]
```

- `--manifests`: directory containing `components.json` (and optionally `docs.json`).
  Defaults to the package's baked `manifests/` directory. For split/ref manifests
  (`experimentalDocgenServer` builds), the referenced `services/` payloads resolve from the
  sibling of the manifests directory.
- MCP endpoint: `http://<host>:<port>/mcp` (streamable HTTP).

## Local development

```bash
# Build the Storybook so there are manifests to serve
pnpm build-storybook

# Serve them straight from build/storybook
pnpm --filter @droppy/mcp dev

# Or the production bundle
pnpm --filter @droppy/mcp build
pnpm --filter @droppy/mcp serve
```

`pnpm --filter @droppy/mcp prepare-publish` reproduces what CI does before packing: it
copies the manifests into the package, writes `provenance.json`, stamps the version, and
lifts the `private` flag. It mutates `package.json` in place — never commit its output.

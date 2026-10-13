# Dagre

`dagre-1.1.5.min.js` is the unmodified browser bundle from `@dagrejs/dagre@1.1.5`.
Source: https://github.com/dagrejs/dagre/tree/v1.1.5
License: MIT, included in `LICENSE`.

To retrieve this exact release, run `npm pack @dagrejs/dagre@1.1.5`, then copy
`package/dist/dagre.min.js` and `package/LICENSE` from the archive. No Node.js
runtime or build step is needed to serve the site.

`assets/research-map.js` measures the bilingual HTML nodes and uses Dagre for
rank and node placement on resize and language changes. Orthogonal connectors
use those computed bounds and the gaps between adjacent ranks. If the
bundle cannot load, the same content remains available as a linked text list.

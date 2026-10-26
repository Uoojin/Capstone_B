# Third hero interaction: ORBIT MORPH

Reference inspected: user-provided 2.49s screen recording (1032×918). The reference's local band displacement/compression and recovery rhythm was applied to the existing typography; its graphics/colors were not copied.

## Scope

Only `sync-motions.js`, `type-engine.js` and new `orbit-morph.js` changed for this task. Original assets, initial layout, hero UI, onboarding, page loader, headers and other pages remain untouched.

- Random selection now has three equal branches: ORIGINAL, ELASTIC BOUNCE, ORBIT MORPH.
- The existing `createSyncMotion` elastic controller, original orbital equations and default travel function remain byte-for-byte unchanged.
- C is triggered through the same existing two-node SYNC connection as A/B and retains its 5.15s duration.

## New effect

C uses the existing ORIGINAL orbital direction/path as its baseline. Two participating typographies have independent pulse periods/phases. Their temporary inward offsets are restored before the next existing physics step. This preserves the original orbit calculation and prevents frame-to-frame displacement accumulation.

The original DEFAULT SVG is rasterized locally only for the effect's duration and deformed using non-affine horizontal bands: local pinch, bend/shear and vertical compression. This is not a whole-object zoom, alpha fade or alternate-asset replacement. Existing artwork rotation is retained. Directly dragged cores are excluded from the added pull/deformation, leaving ownership with the existing drag logic.

Start/end envelopes are zero at 0 and 5.15s. The endpoint draws the unmodified SVG directly. Event disposal/unmount restores pending baseline positions and releases cached raster canvases.

## Verification

- Uniform selector boundaries: 100 samples per branch across 300 evenly spaced random inputs.
- Exact additive position restoration across 310 simulation samples and 20 consecutive dispose cycles; independent phase differences and pinned-drag exclusion checked.
- All eight original SVGs produce visibly different intermediate geometry and pixel-identical beginning/end renderings in an isolated browser canvas.
- Actual node-to-node mouse drag triggered C in the live engine at 1920×1080 and 1024×768. Non-affine band rendering was observed during the event and stopped entirely after expiry. No page errors.
- Production build and targeted ESLint pass. Physical tablet touch hardware was not tested here.

`glyph-comparison.png`: DEFAULT and deformed state on the top row of each tile; restored state below. `live-*.png`: actual running engine. JSON files contain the measured checks. The browser engine test's closure getters are injected only by the temporary test script; no test/debug API was added to production.

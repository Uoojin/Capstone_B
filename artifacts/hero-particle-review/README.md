# Hero particle / collision verification

- The archived engine matches the pre-change Git version byte for byte. Its ORIGINAL interaction remains unmodified in plain text and is not imported by the application.
- Existing DEFAULT/SYNC SVG files, pair mapping, crossfade rendering, initial layout, styles, cursor, onboarding and other pages were not edited for this task.
- The former motion selector and second/third controllers were removed. The new collision sequence lasts 4.8 seconds, with actual silhouette contact, two separate centre bursts, dissipating rebounds, bounded neighbour springs and stationary final pair positions.
- Particles reuse the four SVG geometries from PageTransition and four symbol SVG assets. No source SVG was modified.

Validation:
- Targeted ESLint passed; Vite production build passed (existing large-chunk warning).
- `node --test tests/heroCollisions.test.mjs`: two tests passed, covering painted contact, no false contact bursts, separate initial centres, chain rebound, neighbour recovery, viewport containment and final pair state.
- `chromium.json` and `webkit.json`: desktop Chrome and Playwright WebKit passed empty-click bursts (14 particles), expiration, typography release/return bursts, actual node connection events, DEFAULT/SYNC rendering and fixed final pair positions. No runtime errors in the isolated hero harness.
- Browser checks add a read-only state reader to the served engine in the test response only; production source has no debug interface. Typography dragging uses mouse events; exact moving-dot connection uses pointer events with capture stubbed in the harness.
- Safari itself and physical touch devices were not tested. WebKit is an engine compatibility check.
- Relative screen displacement in the drag report includes the existing camera and idle movement and is not a world-position return error.

Re-run: start Vite on port 5180, make Playwright available through NODE_PATH or PLAYWRIGHT_MODULE, and run `node artifacts/hero-particle-review/browser-check.cjs`. Set HERO_TEST_URL if the local base URL differs.

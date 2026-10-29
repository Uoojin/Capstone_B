# Hero billiards correction

## Implementation

- Independent circular collision bodies use the existing typography orbit radius. Circle normals and relative closing velocity determine normal impulses, tangential friction and bounded angular response (maximum 0.13 radians).
- A position solver resolves every touching pair, including neighbours during spring return. Fixed substeps prevent tunnelling. Resting final pair bodies remain obstacles to subsequent idle motion.
- A short forward simulation evaluates initial approach velocities in the unchanged layout. Only initial velocities are selected. Live motion has no waypoints, timed kicks or invented collision events. The solver targets 3–5 secondary contacts, dissipates energy after real contacts, and waits for neighbours to settle. Geometrically impossible contacts are never manufactured to reach a count.
- Initial contact uses the unchanged DEFAULT/SYNC pair mapping and original crossfade. It emits two strong bursts, one at each body centre. Later contacts emit smaller bursts at both participating body centres. Uninvolved typography never receives a SYNC SVG.
- Collision particles travel 0.95–1.30 orbit radii with a rapid attack and ease-out. They render on a separate pointer-transparent effect canvas above the typography. All eight existing shapes/symbols are reused. Empty-click particles keep their former velocity/damping behaviour.
- Direct typography drag coordinate updates and pointer release were restored from the preserved original. New direct-drag springs, clamps and release particles were removed. SYNC physics is separate.

## Validation

- Four unit tests pass: circle contact, horizontal and vertical 3–5 contact chains, position correction, actual contact/impulse records, neighbour recovery, fixed final pair, and 30/60/120 Hz substeps.
- `chrome.json` and `webkit.json` contain actual browser T–N connection results: 5 secondary contacts each, maximum circle penetration 0px, no SVG mapping errors, no wholly invisible active typography frames, final pair stays, neighbours return within 0.000002px, and no runtime errors.
- First particles reached approximately 1.26–1.28 times the existing orbit radius. Overlay has `pointer-events: none`. Empty click emits 14 particles and expires. Direct drag emits 0 particles and has no elasticReturn state.
- The test harness uses real pointer events for direct drag and exact-coordinate pointer events for the moving node connection. A read-only state accessor is injected in the test response only, never in production source.
- Targeted ESLint and production build pass. The existing bundle-size warning remains.
- Actual Safari 26.6.2 WebDriver was attempted. Safari rejected session creation because Allow remote automation is disabled in its Developer settings. This is recorded in `safari-status.json`; WebKit results do not claim an actual Safari app run.
- Original archive SHA-256: 436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d (unchanged). Original SVG mapping and direct-drag release block match verbatim.

Re-run with Vite on port 5180 and `PLAYWRIGHT_MODULE` pointing to Playwright: `node artifacts/hero-billiards-review/browser-check.cjs`. `HERO_TEST_URL` overrides the local base URL.

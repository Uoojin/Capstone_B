# Linked elastic pair, shared camera and secondary SYNC

This review supersedes the free-coasting silhouette implementation while retaining its SVG contour contact, whole-object spin and particle artwork.

## Implementation

- The original two bodies carry an off-centre, rotating elastic attachment. Stretch creates tension and contact impulses create rebound. Both endpoints receive opposite forces and contact torque; initial cue momentum moves their midpoint through the scene. There are no timed direction kicks or fake collision particles.
- The main movement remains active until repeated wide separation/reapproach cycles occur, a surrounding body has actually been struck, and another main-pair contact has followed that surrounding reaction (with a safety settling phase for sparse layouts).
- Camera follows both rotated SVG bounds, anticipates short velocity horizons and adapts its view range. Its zoom is a view transform, not a change to SVG size, physics geometry or base layout. Movement starts after the initial smooth two-body focus. Current bounds are fitted after physics too, preventing a trailing camera from losing a body.
- Canvas, effects, pointer/world conversion, hover pause and the existing read-only handoff geometry all use the same camera transform. Main collision coordinates remain in world space.
- At finish the main bodies settle naturally into a composition near the saved pre-SYNC view and remain at their final poses. Neighbours return to their saved poses. The camera then eases to the saved hero centre, fitting the final pair if the viewport needs a wider range. There are no viewport reflections or position teleports.
- A real surrounding contact starts that body's own existing paired SVG, using the unchanged pair table and its actual collision partner. Fade in 0.35s, complete-state hold at least 0.7s, fade out 0.45s. Repeated same-partner contacts extend the hold; a different partner can queue an existing SVG transition without replacing the main pair's mapping. The response collider and draw layer use the same visual envelope.
- Original eight particle assets, quantities, radial explosion style, behind-SVG canvas, alpha cutout and pointer transparency remain. Direct typography drag has no added particle/return-spring effect.

## Validation

- Chrome and WebKit, 1440x900: two wide elastic separation/reapproach cycles; 7 and 9 actual main-pair contacts in the saved runs; 2 and 3 surrounding contacts. Main-pair contacts continued after the first surrounding SYNC.
- Every moving/post-focus and returning camera frame checked kept both initial SVG bounds visible: zero clipped frames. No remaining painted overlap, SVG mapping errors, nonuniform SVG draw transforms or runtime errors in saved browser runs.
- Surrounding SYNC reached blend=1, held for multiple frames, then all SVG states returned to DEFAULT. Full-state observations were tied to actual contact partners; unhit letters never changed.
- Final pair pose stayed fixed. Neighbours returned within the solver's subpixel settling threshold; final cleanup aligns the last subpixel to the exact saved pose. Camera returned to the saved hero centre. Desktop view returned to zoom=1; the narrower viewport retained the fit needed for both final bodies.
- Chrome 1024x768: three wide cycles, three main contacts, eight surrounding contacts in the saved run. All moving and returning visibility checks passed; all surrounding final position/angle errors were zero. The layout and base artwork dimensions were not changed.
- Planning is sliced into 5ms RAF budgets. The saved narrow-view run needed about 1.8 seconds of wall time to search for a real trajectory; the camera remains live during focus. p95 frame times were about 16.7–17ms. This is not a guarantee of no individual slow frames or an identical trajectory across all layouts.
- Fourteen unit tests pass, including camera/world round trips; two-body fit at 1440x900, 1024x768 and 768x1024; smooth camera return; actual rotated painted contact; orbit-independent collision; offscreen neighbour recovery; fixed-step 30/60/120Hz consistency; suspended-tab clock handling; secondary fade/hold/fade; and no secondary change on an unhit letter.
- Targeted ESLint, production build and whitespace checks pass. The existing large-bundle warning remains.
- Browser harness uses original scene styles and original SVG assets. Direct drag uses mouse events; moving-dot connection uses exact visible-node pointer events. A read-only state accessor is injected in the test response only. No production debug global was added.
- Actual Safari app automation remains unavailable because its Allow remote automation setting is disabled (see the preceding silhouette review's safari-status.json). The WebKit result is labelled separately and does not claim an actual Safari app run.

Original interaction archive SHA-256: 436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d (unchanged). The original pair table, base SVG files/angles and direct-drag release block were checked verbatim.

Run unit checks: node --test tests/heroCamera.test.mjs tests/heroCollisions.test.mjs.
Run desktop browser checks with Vite on 5180: node artifacts/hero-elastic-review/browser-check.cjs.
Run compact check: node artifacts/hero-elastic-review/browser-check.cjs 1024 768 chrome.
Final reports: chrome.json, webkit.json, chrome-1024x768.json. The saved burst, rolling and secondary-sync PNGs accompany these reports; probe files are development diagnostics.

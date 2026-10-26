# First-visit onboarding — live hero handoff

The original 0–5.05s opening remains unchanged. Only the final desktop/tablet spread has been replaced.

## Final movement

- The eight existing DEFAULT assets expand from the central onboarding cluster toward the current hero frame.
- Targets come from a read-only bridge into the canvas engine: existing letter identities, current world positions minus camera offset, actual canvas screen dimensions, original image aspect ratios, typography size and rendering angles.
- Targets are sampled every animation frame, including after viewport resize. No hero state or placement calculations are changed.
- The overlay stays opaque until arrival: no crossfade, duplicate live-hero letters or separate reappearance.
- At 6.96s, React removes the matched overlay synchronously before the next paint and restores the original page interactions. The existing central brand image is matched to the hero's actual image bounds too.
- Mobile has no interactive hero canvas and retains its existing poster transition.

## Files changed for this correction

- `FirstVisitSplash.jsx`: replace final crossfade with live geometry interpolation and synchronous handoff; cancel the added animation frame loop on cleanup.
- `heroHandoff.js`: a read-only WeakMap registry for the canvas reader.
- `type-engine.js`: register/unregister that reader. Existing drawing, sizing, rotations, placement, physics, mouse/touch and scrolling code remain unchanged.

## Verification

Chromium automation, 1920×1080, 1440×900, 1024×768 and 820×1180:

- All eight final centers and widths agree with the live hero within 0.005px (browser inline-style serialization rounding); angles agree exactly.
- Independently intercepted the actual canvas `drawImage` transforms and checked visible letters after resizing 1440×900 → 1024×768 during the spread. Position error below 0.001px. Offscreen letters excluded by the engine's existing culling rule are identified separately.
- White backing remains fully opaque; navigation hidden and input locked during movement.
- Actual pointer capture/drag and page scroll work after completion.
- Session completion and reload skip still work; no page errors in the four tested sizes.
- Targeted ESLint and production build pass.

Results: `handoff-checks.json`, `handoff-paint-resize-check.json`. `handoff-moving-*.png` shows the current final movement. Older contact sheets document the previous crossfade implementation and are retained as history. Physical Safari/iPad has not been tested here.

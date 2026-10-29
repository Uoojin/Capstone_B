# Painted-SVG rigid-body hero interaction

This folder supersedes the earlier orbit-circle implementation and its reports.

## Behaviour

- Collision geometry comes from the existing SVG's painted alpha at the same 400px max-side size used for drawing. A 2px signed distance grid preserves thin strokes and transparent holes. Transformed contour samples and surface normals follow the exact artwork centre/base angle plus the body's live rotation. Orbits and orbit dots never participate in contact or impulses.
- Bodies carry position, linear velocity, angle, angular velocity, mass and inertia. Normal/tangential contact impulses use velocity at the contact point, including angular velocity. Signed travel supplies a smooth rolling response; there is no random rotate or former 0.13-radian rotation clamp.
- Contact penetration is projected with multiple passes. Every emitted collision contains a painted-contour witness and incoming/outgoing velocities. SVG replacement starts only at the first real A/B contact, with the original pair table and crossfade (0.35s in / 0.45s out).
- Initial approach conditions are evaluated by the same 1/300s solver as live playback. Planning uses bounded 5ms RAF slices and stops after finding a useful physical chain. No post-impact aiming forces, predetermined paths, timed kicks or fake contacts are used. The 3–5 target counts only active/neighbour contacts; A/B recontacts do not advance it. Actual counts remain geometry dependent.
- Neighbours coast for 0.55s before position/angular springs bring them home. They may leave the viewport and are still tracked; no viewport or scene wall reflections exist. Final A/B positions AND angles persist. Returning neighbours still take part in painted-shape contact resolution.
- Particles use the existing eight geometries/symbols. Separate effect canvas: background < particles (z=0) < typography/controls (z=1). The effect canvas is pointer transparent. An SVG alpha cutout on the effect surface prevents particles showing through translucent crossfades. No SVG pixels, original assets, glow, blur or gradients are added/edited. Primary bursts have 24 objects per centre; later contacts have 9 per centre.
- Direct drag retains the original coordinate/release behaviour. It has no added particle burst or return spring. The original interaction snapshot remains immutable and unimported.

## Verified results

- Chrome and Playwright WebKit, 1440x900, real SVG assets and visible T/N controls: 4 actual secondary neighbour contacts each. Every impact has a painted witness; sampled post-solve penetration was 0px in these runs. No wall events, distorted draw transforms, SVG mapping errors or runtime errors.
- Whole-object rotation was visibly measured on both active letters (Chrome about 153°/51°, WebKit about 150°/26° in the saved runs). The surrounding letters reacted with their own contact-driven spin and returned within 0.01px / 0.001 radians. Final active pair position and angle remained fixed after completion.
- First particles reached about 1.28 existing orbit radii. Crossfade occlusion and layer order verified; empty clicks still create 14 particles and expire; direct drag creates zero particles and no elasticReturn state.
- Frame interval p95 was about 16.8ms in Chrome and 17ms in WebKit. Initial launch search took about 24ms total CPU, sliced over about 100–113ms of live frames. A few slower frames remain recorded in the raw reports; this is not a zero-frame-drop guarantee.
- Seven unit tests pass: holes/empty space, rotated contact, no premature SYNC/particles, signed rolling direction, orbit-independent trajectories, offscreen neighbour position/angle recovery, final pose preservation, 30/60/120Hz agreement and paused-tab clock handling.
- Targeted ESLint, production build and whitespace checks pass. Existing large-bundle warning remains.
- Actual Safari WebDriver was attempted again and rejected session creation because Allow remote automation is disabled in Safari's Developer settings. See safari-status.json. WebKit verification does not claim an actual Safari app run.

Original snapshot SHA-256: 436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d. SVG mapping, base angles and original direct-drag release block were checked verbatim.

Run unit checks: node --test tests/heroCollisions.test.mjs. Run browser checks with Vite on 5180: node artifacts/hero-silhouette-review/browser-check.cjs. The harness adds a read-only state accessor in its intercepted test response only; production source contains no test global. Probe files are development diagnostics; chrome.json / webkit.json and browser-check.cjs are the final validation records.

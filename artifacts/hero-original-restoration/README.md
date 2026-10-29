# ORIGINAL hero restoration

Baseline: `73651e0d16041c38792d2b76ae906b5e1713dff7`.

The actual production `type-engine.js` was restored from this Git blob. Its only differences from that blob are removal of the imports and selector/controller creation for the non-ORIGINAL modes, and setting `syncEvent.motion` to `ORIGINAL`. All pointer handlers, hit thresholds, typography travel, camera code, SVG mapping/crossfade, timing, layout and onboarding bridge are verbatim baseline code.

The baseline sequence is deliberately preserved: drag a dot, connect to another dot, then the typography attraction and camera response run. The SVG crossfade begins 0.28s after connection, takes 0.35s to fade in, and fades out over the final 0.45s of the 5.15s event. No painted-contact gate or pre-connection typography drag coupling was added.

Removed the five new `hero-artwork`, `hero-boundary`, `hero-camera`, `hero-collisions`, and `hero-particles` modules and their two obsolete unit-test files. Prior non-ORIGINAL mode files remain removed. Historical review artifacts are evidence of prior iterations, not running application code. The original preservation archive was not modified.

## Verification

The adjacent browser harness loads the actual restored module and real SVGs, with only a test-response observation hook. It does not substitute a Git engine or force a mode through a test dependency.

Chrome and WebKit both passed:

- Existing dot pointer capture, dragging and node connection.
- Direct typography dragging, following its world-space drag target, pointer release and base-position update.
- Connection starts ORIGINAL with exactly 5.15s duration.
- At around 0.8s after connection, the source typography had moved about 122px and camera about 179px.
- First mapped T/N replacement was drawn at about 0.30s with the original crossfade opacity.
- ORIGINAL ended normally with no browser runtime errors.

Actual Safari WebDriver was attempted again. It refused to create a session because Safari's “Allow remote automation” setting is disabled; see safari-status.json. The WebKit check does not claim a real Safari app pass.

Targeted ESLint, production build and git diff whitespace checks passed. The existing >500kB build warning remains. Hash checks confirmed all other source files, SVGs, CSS, onboarding, layouts and responsive code were untouched by this restoration.

Original preservation archive SHA-256: `436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d`.

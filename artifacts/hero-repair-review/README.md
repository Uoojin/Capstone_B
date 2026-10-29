# Hero drag and collision repair

Only the hero engine, painted-contact helper, collision controller and regression tests were edited for this repair. Existing SVG files, mappings, cursor, direct typography dragging, camera functions, responsive layout and the original interaction archive were preserved.

## Changes

- Connect a grabbed orbit dot to the existing team drag-target interpolation (0.10), preserving its world-space grab offset as the original camera moves. Initialize the already-present teammate-follow path (0.34). On release, reuse the original gradual spacing recovery instead of immediately enforcing full orbit clearance.
- Keep the original node hit thresholds and connection trigger. Connection starts approach physics; the actual painted-outline contact alone activates SVG transitions and particles. Pointer release does not inject any impulse.
- Keep the restored camera functions byte-identical to the code from Git commit `73651e0`, including the 900ms focus and 0.032 / 0.0065 interpolation values. Zoom stays 1.
- Main membership remains the immutable initial pair. Ordinary-to-ordinary contacts can transfer physical impulse but cannot create SVG responses, particles or a main SYNC participant. A fresh main-to-ordinary hit resets the ordinary body's recoil interval, so it actually recoils before returning.
- Particle emission is restricted to the two requested collision cases. The earlier empty-space click burst is disabled accordingly; typography and dot release also emit nothing.
- Latch an impact until painted outlines have separated by 6px. This tolerance is used only to rearm the effect; actual impulse/effect collision detection retains its original 0.1px painted-distance threshold. Position-projection passes cannot repeatedly emit an impact.
- Remove main-body parking and heavy damping during exit cleanup. The tether, rolling and collision response continue until completion. The existing ending decision expression, fade durations and 30s safety ceiling remain. Once neighbors have returned and the existing final SVG fade begins, they become passive collision obstacles, so final cleanup cannot reopen their visual reactions indefinitely.

## Verification

The reproducible browser harness uses production code and real SVG assets with test-response-only observation hooks. Reports are `chrome.json` and `webkit.json`.

| Check | Chrome | WebKit |
| --- | ---: | ---: |
| Team displacement toward the target while holding an unconnected dot | 62.0px | 62.0px |
| Camera displacement during that drag | 36.3px | 35.3px |
| Position step after pointer release | 0.28px | 0.29px |
| Main-pair actual impact episodes | 18 | 18 |
| Completed wide separation/recontact cycles | 11 | 11 |
| Neighbor final position error | 0px | 0px |
| Zoom values | 1 | 1 |
| Runtime errors | 0 | 0 |

Both runs verified nonzero main motion in the last 30 active frames, actual contact witnesses, exactly two particle bursts per eligible impact, no ordinary-only visual events, normal completion, and neighbor return. Absolute run length varies with contacts and return completion under the unchanged ending predicate; no new end timer was introduced.

All 16 Node regression tests passed, including ordinary-to-ordinary physical impact without visual propagation, impact-latch rearming, and continued main translation/rotation during exit cleanup. Targeted ESLint, production build and `git diff --check` passed (the existing bundle-size warning remains).

Actual Safari app automation is blocked by its disabled remote-automation setting; WebKit passed as an engine check, not an actual Safari app run. See `../hero-silhouette-review/safari-status.json`.

Original archive SHA-256 remains `436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d`.

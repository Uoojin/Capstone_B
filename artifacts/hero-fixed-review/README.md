# Fixed-view SYNC interaction verification

The hero projection stays at its initial position and scale (zoom = 1). Tracking,
panning and zoom transitions have been removed. Only the typography bodies move.

The primary pair alternates between attraction and recoil. Attraction stores
elastic energy; an actual approaching painted-outline contact releases it through
the contact normal. Attraction is disengaged during recoil until the pair has
separated sufficiently or spent its outward momentum. Off-center attachments,
contact torque and independent velocities produce different paths and rotations.
Soft velocity forces near viewport edges keep the primary pair visible without
position clipping, teleports or camera movement. Neighbors retain their impact,
temporary mapped SYNC, particle and spring-return behavior.

Existing termination expressions (including the 4.8 / 10.5-second clauses and
30-second safety ceiling) remain. No new duration or timed rebound was added.
Completed elastic cycles now require actual recontact after at least 100px of
additional separation; tiny repeated contacts do not satisfy that cycle counter.

## Recorded browser runs

| Browser / viewport | Main contacts | Completed wide cycles | Largest added separation | Camera changes | Fully hidden main-pair frames |
| --- | ---: | ---: | ---: | ---: | ---: |
| Chrome 1440 × 900 | 13 | 5 | 224.4px | 0 | 0 |
| WebKit 1440 × 900 | 14 | 5 | 222.4px | 0 | 0 |
| Chrome 1024 × 768 | 12 | 2 | 174.7px | 0 | 0 |

Reports and screenshots are adjacent to this document. The browser harness uses
real SVG assets and the production solver, injecting read-only observation hooks
only into the intercepted test response. It checks contact witnesses, matching
particles, per-letter SVG mapping, independent motion/spin, fixed projection,
visible painted pixels, neighbor return and retained final primary positions.
All runs reported zero residual penetration, mapping errors, distorted draws and
runtime errors. Partial cropping at an edge is possible; neither primary body
became completely invisible. Direct typography dragging produced no particles or
new elastic return.

Actual Safari application automation is unavailable because Safari's remote
automation setting is disabled (see ../hero-silhouette-review/safari-status.json).
The WebKit result is an engine check, not a claim of an actual Safari app run.

## Other checks

- 13 Node tests passed, covering painted geometry, contact impulses, repetition,
  fixed-step timing, fixed projection, continuous boundary steering, viewport
  resize, secondary return and mapped SVG state envelopes.
- Targeted ESLint and production build passed. The existing bundle-size warning
  remains. `git diff --check` passed.
- Original interaction archive is byte-identical to the original engine at HEAD:
  SHA-256 `436d1bae660d92962f6d13c820faa837b47c6bdd790477ae593609fbecd1656d`.
- SVG assets and alphabet mapping, direct typography drag release behavior,
  initial layout, particle designs and unrelated page changes were preserved.

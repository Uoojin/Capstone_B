# SYNC after the protected ORIGINAL hero

## Recovery point and scope

`a566a6c` preserves the working ORIGINAL hero before the new controller. That commit contains only the hero restoration and the unchanged original archive; unrelated working-tree edits were not staged. No implementation changes have been pushed.

Production changes are limited to `type-engine.js` adapters and three new modules:

- `sync-artwork.js`: read-only 2px alpha/signed-distance geometry of the existing SVGs, including holes and rotations.
- `sync-billiards.js`: fixed 1/300-second steps; real painted contacts, normal/tangential impulses, torque, recoil/attraction cycles, temporary secondary responses and returns.
- `sync-particles.js`: existing four PageTransition Shape geometries copied verbatim, plus the four existing symbol SVG assets. No SVG asset or transition component was edited.

The ORIGINAL pointer handlers (including direct typography dragging), connection thresholds, camera functions/range/900ms focus/0.032 and 0.0065 interpolation, layout function and 56 pair-SVG mappings remain unchanged. The new controller is instantiated only at the end of the existing `triggerTeamSync`. It supplies team world positions to the existing camera; no zoom or alternate camera system exists.

The event owns post-connection physical movement only. The existing SVG drawing and pair lookup are reused, with the same 0.35s fade-in and 0.45s fade-out; the new collision response anchors the fade to actual painted contact, as requested. Secondary SVGs use the contacted main partner's original pair mapping. Main membership is immutable and cannot spread via temporary SVG appearances.

## Motion and finish

Five major contacts are the normal target: initial contact plus four clear separation/recontact cycles. A major recontact requires at least 100px of extra separation; usual departures reach about 210px. Forces and actual impact normals determine paths, impulses and rotations. There are no waypoint collisions or empty-space particle triggers. A maintained contact cannot rearm its effects until painted silhouettes clear by 6px.

After the final major contact, attraction releases and motion decays. Neighbor return and SVG cleanup complete before the event ends. Main bodies remain at their final positions and angles; neighbors retain their original home positions and angles. Final cleanup cannot reopen secondary SYNC indefinitely. A bounded safety path releases the drive after 20 simulated seconds if geometry prevents the target count; it never invents impacts to satisfy a count.

The restored ORIGINAL baseline did not contain an empty-space click burst, so no separate click interaction was introduced. Rear particles are pointer-transparent, capped at 160, and masked by the painted SVG silhouettes during crossfades.

## Verification

10 Node tests passed: rotated painted geometry and holes; genuine impact/event correspondence and contact latching; orbit-radius independence; 30/60/120 FPS equivalence; secondary response/return; ordinary-only physical contacts without visual propagation; original SVG ramp timing; paused-tab timing; active resize; exact source preservation of pointer/camera/layout/connection functions against `a566a6c`.

Targeted ESLint, production build and `git diff --check` passed. The existing bundle-size warning remains. Hash comparison confirmed every other source file, SVG asset, stylesheet, page, onboarding file and original archive stayed unchanged.

Browser tests load the actual production module and real assets, with observation hooks injected only into the test response. They check direct dragging before SYNC, actual contact witnesses, mapping, rolling, particle masking, completed motion, neighbor return, a second SYNC and active resize to 1024px.

| Latest desktop run | Chrome | WebKit |
| --- | ---: | ---: |
| Major physical contacts | 5 | 5 |
| Extra separation in completed release cycles | 210–214px | 212–214px |
| Pair midpoint travel | 503px | 563px |
| Camera travel (existing pan only) | 318px | 286px |
| Residual painted penetration sampled after frame solve | 0px | 0px |
| Neighbor final position error | 0px | 0px |
| p95 frame interval | 16.7ms | 17ms |
| Runtime errors | 0 | 0 |

Both repeated-SYNC/active-resize runs also finished with five major contacts and zero neighbor position error. A separate 1024px Chrome run passed. One valid WebKit trajectory did not hit a neighbor; it correctly produced no secondary SVG/particle response (retained separately as evidence). Secondary collisions are conditional on actual contact, not guaranteed by a script.

Actual Safari WebDriver was attempted, but Safari refused a session because “Allow remote automation” is disabled; see safari-status.json. WebKit passing is not a claim of a real Safari app pass.

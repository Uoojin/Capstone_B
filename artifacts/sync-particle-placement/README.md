# Particle placement only

Main-pair contacts retain two simultaneous 360-degree orbit-sized bursts at their individual SVG centers. Secondary contacts now emit one burst exactly at the already-computed painted contact point, with full radial spread shaped along the actual contact normal and impact speed. The old aggregate particle quantity is retained: two 10-object bursts become one 20-object burst (12 total with reduced motion). The eight SVG designs, lifetimes, fade, size, rear canvas, masking and pointer transparency are unchanged.

The only change inside sync-billiards.js is its particle emission block, after the existing impact record. No mass, velocity, torque, geometry, contact threshold, latch, response, timing or completion code changed. The only engine change forwards the existing impact metadata as an extra particle-renderer argument. Source comparison verified both boundaries exactly. SVG asset/image construction is also byte-identical to the previous renderer.

Before/after fixed-step regression traces matched byte-for-byte (position, velocity, angle, spin, contacts, SVG responses, event duration and phase) across three fixtures, including an actual secondary impact. Their completion times stayed 4.40s, 5.8667s and 5.0667s respectively. Only the secondary burst count changed from two origins to one.

12 unit tests, targeted ESLint, production build and git diff checks passed. The new tests verify both primary center coordinates and shared secondary contact coordinates, simultaneous timestamps, normal orientation, impact-dependent spread, full radial coverage and preserved total particle quantity.

Chrome and WebKit actual-engine runs passed: five major contacts, secondary contact-coordinate emissions, rear-layer masking, correct SVG mapping, normal completion and neighbor return, with no runtime errors. Reports and unchanged primary burst screenshots are adjacent. The existing bundle-size warning remains.

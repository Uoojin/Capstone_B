import { createSvgStateMorph } from './svg-state-morph.js'

const TRANSITION = .71
const SYNC_HOLD = .9
const DEFAULT_HOLD = .5
const CYCLE = TRANSITION * 2 + SYNC_HOLD + DEFAULT_HOLD

// Preserve the previous cosine/power interpolation; only add endpoint holds.
export function orbitSvgState(age, index) {
    const elapsed = age - .5 - index * .16
    if (elapsed <= 0 || elapsed >= CYCLE * 2) return 0
    const local = elapsed % CYCLE
    if (local < TRANSITION) return Math.pow(.5 - .5 * Math.cos(Math.PI * local / TRANSITION), 1.45)
    if (local < TRANSITION + SYNC_HOLD) return 1
    if (local < TRANSITION * 2 + SYNC_HOLD) return Math.pow(.5 + .5 * Math.cos(Math.PI * (local - TRANSITION - SYNC_HOLD) / TRANSITION), 1.45)
    return 0
}
// SVG state only: movement and rotation come directly from createSyncMotion,
// the same controller used by ELASTIC BOUNCE. Never offset its coordinates.
export function createOrbitMorph(event) {
    event.duration = .5 + CYCLE * 2 + .16 + .6
    const teams = [event.teamA, event.teamB]
    const poses = new Map()
    // Each letter owns its writable output surface. The SVG fields remain
    // immutable/shared, but one letter must never overwrite another's bitmap.
    const renderers = new Map(teams.map(team => [team, createSvgStateMorph()]))

    function update(age) {
        teams.forEach((team, index) => poses.set(team, orbitSvgState(age, index)))
    }

    function draw(ctx, image, interaction, maxSide, team) {
        renderers.get(team)?.draw(ctx, image, interaction, poses.get(team) || 0, maxSide)
    }

    function dispose() {
        poses.clear()
        renderers.forEach(renderer => renderer.dispose())
        renderers.clear()
    }

    return { update, draw, dispose, owns: team => teams.includes(team) }
}

// Event-local physics. ORIGINAL never instantiates this controller.
const TAU = Math.PI * 2
const clamp = (value, low, high) => Math.max(low, Math.min(high, value))
const smooth = value => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x) }

export function chooseSyncMotion() {
    return Math.random() < .5 ? 'ORIGINAL' : 'ELASTIC BOUNCE'
}

export function createSyncMotion(event, artwork) {
    const bodies = [event.teamA, event.teamB].map(team => ({
        team, x: team.currentX, y: team.currentY,
        vx: team.velocityX, vy: team.velocityY,
        angle: 0, omega: 0, pinned: false, entered: false,
        // Include both SVGs throughout the existing crossfade, without scaling them.
        shapes: artwork(team),
    }))
    let launched = false
    let hits = 0
    let cooldown = 0
    let burst = null
    let nextBurstAt = .28 + Math.random() * .32
    let lastAge = 0
    const direction = event.spin
    const phase = event.phase

    for (const body of bodies) {
        body.inertia = Math.max(...body.shapes.sizes.map(size => (size.w ** 2 + size.h ** 2) / 12))
        for (const size of body.shapes.sizes) {
            if (!size.pixels) continue
            // Sample the real painted silhouette, including holes and thin strokes.
            // Boundary points are enough to detect overlap in either direction.
            size.edge = []
            const { maskWidth: w, maskHeight: h, pixels } = size
            const opaque = (x, y) => x >= 0 && y >= 0 && x < w && y < h && pixels[(y * w + x) * 4 + 3] > 40
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
                if (opaque(x, y) && (!opaque(x - 1, y) || !opaque(x + 1, y) || !opaque(x, y - 1) || !opaque(x, y + 1))) {
                    size.edge.push({ x: ((x + .5) / w - .5) * size.w, y: ((y + .5) / h - .5) * size.h,
                        nx: Number(opaque(x - 1, y)) - Number(opaque(x + 1, y)),
                        ny: Number(opaque(x, y - 1)) - Number(opaque(x, y + 1)) })
                }
            }
        }
    }

    function visibleShapes(body) {
        const blend = Math.min(clamp((lastAge - .28) / .35, 0, 1), clamp((event.duration - lastAge) / .45, 0, 1))
        return body.shapes.sizes.filter(size => size.replacement === undefined || (size.replacement ? blend > .05 : blend < .95))
    }

    function paintedContact() {
        const contacts = []
        for (const [index, source] of bodies.entries()) {
            const target = bodies[1 - index]
            const [u, v] = axes(source), [tu, tv] = axes(target)
            const targetShapes = visibleShapes(target)
            for (const size of visibleShapes(source)) {
                if (!size.edge) continue
                for (const point of size.edge) {
                    const x = source.x + u.x * point.x + v.x * point.y
                    const y = source.y + u.y * point.x + v.y * point.y
                    const dx = x - target.x, dy = y - target.y
                    const localX = dx * tu.x + dy * tu.y, localY = dx * tv.x + dy * tv.y
                    if (targetShapes.some(shape => {
                        if (!shape.pixels) return false
                        const px = Math.floor((localX / shape.w + .5) * shape.maskWidth)
                        const py = Math.floor((localY / shape.h + .5) * shape.maskHeight)
                        return px >= 0 && py >= 0 && px < shape.maskWidth && py < shape.maskHeight &&
                            shape.pixels[(py * shape.maskWidth + px) * 4 + 3] > 40
                    })) {
                        const sign = index === 0 ? 1 : -1
                        contacts.push({ x, y, nx: (u.x * point.nx + v.x * point.ny) * sign,
                            ny: (u.y * point.nx + v.y * point.ny) * sign })
                        if (contacts.length >= 24) break
                    }
                }
                if (contacts.length >= 24) break
            }
        }
        if (!contacts.length) return null
        return { x: contacts.reduce((sum, p) => sum + p.x, 0) / contacts.length,
            y: contacts.reduce((sum, p) => sum + p.y, 0) / contacts.length,
            nx: contacts.reduce((sum, p) => sum + p.nx, 0), ny: contacts.reduce((sum, p) => sum + p.ny, 0) }
    }

    function renderedAngle(body) {
        const turn = body.exitAngle ?? Math.round(body.angle / TAU) * TAU
        return turn + (body.angle - turn) * smooth((event.duration - lastAge) / .24)
    }

    function axes(body) {
        const angle = body.shapes.baseAngle + renderedAngle(body)
        return [{ x: Math.cos(angle), y: Math.sin(angle) }, { x: -Math.sin(angle), y: Math.cos(angle) }]
    }

    function support(body, axis) {
        const [u, v] = axes(body)
        return Math.max(...body.shapes.sizes.map(size =>
            Math.abs(u.x * axis.x + u.y * axis.y) * size.w / 2 +
            Math.abs(v.x * axis.x + v.y * axis.y) * size.h / 2))
    }

    function bounds(body, view) {
        const rx = support(body, { x: 1, y: 0 }) + 10
        const ry = support(body, { x: 0, y: 1 }) + 10
        return {
            left: view.x + Math.min(rx, view.width / 2),
            right: view.x + Math.max(view.width - rx, view.width / 2),
            top: view.y + Math.min(ry, view.height / 2),
            bottom: view.y + Math.max(view.height - ry, view.height / 2),
        }
    }

    function wall(body, view, h, age) {
        const box = bounds(body, view)
        const tx = clamp(body.x, box.left, box.right)
        const ty = clamp(body.y, box.top, box.bottom)
        // Existing typography may start partly outside the viewport. Bring it in
        // continuously before enabling hard walls; never teleport it on launch.
        if (!body.entered) {
            body.vx += ((tx - body.x) * 48 - (tx !== body.x ? body.vx * 8 : 0)) * h
            body.vy += ((ty - body.y) * 48 - (ty !== body.y ? body.vy * 8 : 0)) * h
            const capture = smooth((age - .15) / .65)
            body.x += clamp(tx - body.x, -1250 * h, 1250 * h) * capture
            body.y += clamp(ty - body.y, -1250 * h, 1250 * h) * capture
            if (tx === body.x && ty === body.y && age > .3) body.entered = true
            return
        }
        if (tx !== body.x) {
            body.x = tx
            if ((body.vx < 0 && tx === box.left) || (body.vx > 0 && tx === box.right)) {
                body.vx *= -.88
                body.omega += body.vy * .004
            }
        }
        if (ty !== body.y) {
            body.y = ty
            if ((body.vy < 0 && ty === box.top) || (body.vy > 0 && ty === box.bottom)) {
                body.vy *= -.88
                body.omega -= body.vx * .004
            }
        }
    }

    function collide(h, strength) {
        const [a, b] = bodies
        const dx = b.x - a.x, dy = b.y - a.y
        let overlap = Infinity
        // Separating-axis contact of the rotated artwork bounds, including the
        // alternate SVG: a glancing contact can deflect in any relative direction.
        const distance = Math.max(.001, Math.hypot(dx, dy))
        const contactAxes = [...axes(a), ...axes(b)]
        for (const axis of contactAxes) {
            const projection = dx * axis.x + dy * axis.y
            const depth = support(a, axis) + support(b, axis) - Math.abs(projection)
            if (depth <= 0) return
            overlap = Math.min(overlap, depth)
        }
        const masked = bodies.every(body => visibleShapes(body).every(size => size.pixels))
        const contact = masked ? paintedContact() : { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        if (!contact) return
        // The bounding-box overlap alone never produces an impulse.
        let normal = { x: dx / distance, y: dy / distance }
        if (masked) {
            const length = Math.hypot(contact.nx, contact.ny)
            if (length > .01) {
                const sign = contact.nx * dx + contact.ny * dy >= 0 ? 1 : -1
                normal = { x: contact.nx / length * sign, y: contact.ny / length * sign }
            }
        }
        const movable = bodies.filter(body => !body.pinned).length
        if (!movable) return
        const correction = Math.min(masked ? 2.5 : overlap, 900 * h) / movable
        for (const [i, body] of bodies.entries()) {
            if (body.pinned) continue
            const sign = i === 0 ? -1 : 1
            body.x += sign * normal.x * correction
            body.y += sign * normal.y * correction
        }
        const ra = { x: contact.x - a.x, y: contact.y - a.y }
        const rb = { x: contact.x - b.x, y: contact.y - b.y }
        const closing =
            (b.vx - b.omega * rb.y - a.vx + a.omega * ra.y) * normal.x +
            (b.vy + b.omega * rb.x - a.vy - a.omega * ra.x) * normal.y
        if (closing >= 0 || cooldown > 0) return
        hits++
        cooldown = .065
        // Vary rebound and tangential impulse at actual contacts, never on a timer.
        const restitution = .94 + Math.random() * .12
        const impulse = (-(1 + restitution) * closing + 520 * strength) / movable
        const grazing = (b.vx - a.vx) * -normal.y + (b.vy - a.vy) * normal.x
        const surfaceGrazing = grazing + b.omega * (rb.x * normal.x + rb.y * normal.y) -
            a.omega * (ra.x * normal.x + ra.y * normal.y)
        // Surface friction transfers the spring-driven spin into a sideways
        // rebound. Its direction follows contact velocity, not a direction list.
        const tangent = -clamp(surfaceGrazing * .3, -480, 480) * strength
        for (const [i, body] of bodies.entries()) {
            if (body.pinned) continue
            const sign = i === 0 ? -1 : 1
            body.vx += sign * (normal.x * impulse - normal.y * tangent)
            body.vy += sign * (normal.y * impulse + normal.x * tangent)
            const lever = i === 0 ? ra : rb
            body.omega += sign * (lever.x * (normal.y * impulse + normal.x * tangent) -
                lever.y * (normal.x * impulse - normal.y * tangent)) / body.inertia
        }
        // A real collision releases the current elastic response immediately.
        burst = null
        nextBurstAt = lastAge + .5 + Math.random() * .7
    }

    function releaseBurst(strength) {
        const [a, b] = bodies
        const dx = b.x - a.x, dy = b.y - a.y
        const distance = Math.max(1, Math.hypot(dx, dy))
        const nx = dx / distance, ny = dy / distance
        const movable = bodies.filter(body => !body.pinned).length
        if (movable) {
            const radial = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
            const recoil = clamp((burst.rebound - radial) / movable, 0, 850) * strength
            // The off-centre attachment and existing spin determine the release
            // angle. No fixed axis, ordered direction list, or position keyframes.
            const winding = Math.sin(a.angle - b.angle + burst.twist)
            const tangent = winding * recoil * 1.45
            for (const [i, body] of bodies.entries()) {
                if (body.pinned) continue
                const sign = i === 0 ? -1 : 1
                body.vx += sign * (nx * recoil - ny * tangent)
                body.vy += sign * (ny * recoil + nx * tangent)
                body.omega += sign * winding * 2.4 * strength
            }
        }
        burst = null
        nextBurstAt = lastAge + .48 + Math.random() * .78
    }

    function update(age, dt, view, pinnedTeam, reduced) {
        if (age < 0 || age > event.duration || dt <= 0) return
        lastAge = age
        const [a, b] = bodies
        for (const body of bodies) {
            body.pinned = pinnedTeam === body.team || body.team.dragTargetX !== null
            if (body.pinned) {
                body.x = body.team.dragTargetX ?? body.team.currentX
                body.y = body.team.dragTargetY ?? body.team.currentY
                body.vx = body.vy = 0
            }
        }
        const strength = smooth(age / .2) * smooth((event.duration - age) / .72) * (reduced ? .22 : 1)
        if (!launched) {
            launched = true
            for (const [i, body] of bodies.entries()) {
                if (body.pinned) continue
                // Independent launch headings preserve the pair's freely moving
                // midpoint. No attraction is applied during the coast intervals.
                const heading = phase + (i ? 2.15 : -.35) * direction
                const speed = (i ? 510 : 620) * (reduced ? .22 : 1)
                body.vx += Math.cos(heading) * speed
                body.vy += Math.sin(heading) * speed
                body.omega = (i ? -2.4 : 3.1) * (reduced ? .22 : 1)
            }
        }
        if (!burst && age >= nextBurstAt && age < event.duration - .95 && !bodies.some(body => body.pinned)) {
            const distance = Math.hypot(b.x - a.x, b.y - a.y)
            burst = {
                born: age, duration: .18 + Math.random() * .14,
                rest: Math.max(100, distance * (.24 + Math.random() * .12)),
                stiffness: 28 + Math.random() * 18,
                rebound: 850 + Math.random() * 380,
                twist: a.angle - b.angle + (Math.random() - .5) * 1.8,
            }
        }
        // Substeps resolve contact and wall rebounds without changing the RAF loop.
        const steps = Math.max(1, Math.ceil(dt / (1 / 180)))
        const h = dt / steps
        for (let step = 0; step < steps; step++) {
            cooldown = Math.max(0, cooldown - h)
            let forceX = 0, forceY = 0
            const subAge = age - dt + (step + 1) * h
            if (burst) {
                const elapsed = Math.max(0, subAge - burst.born)
                if (elapsed >= burst.duration) {
                    releaseBurst(strength)
                } else {
                    const offsets = bodies.map((body, i) => {
                        const [u, v] = axes(body)
                        const size = body.shapes.sizes[0], sign = i ? -1 : 1
                        return { x: (u.x * size.w * .2 + v.x * size.h * .14) * sign,
                            y: (u.y * size.w * .2 + v.y * size.h * .14) * sign }
                    })
                    const linkX = b.x + offsets[1].x - a.x - offsets[0].x
                    const linkY = b.y + offsets[1].y - a.y - offsets[0].y
                    const length = Math.max(1, Math.hypot(linkX, linkY))
                    const stretch = Math.max(0, length - burst.rest)
                    // A short, fast attack; exactly zero tether force once released.
                    const attack = smooth(elapsed / .045)
                    const tension = clamp(stretch * burst.stiffness + stretch * stretch * .018, 0, 13500) * attack
                    forceX = linkX / length * tension
                    forceY = linkY / length * tension
                    bodies.forEach((body, i) => {
                        if (body.pinned) return
                        const sign = i === 0 ? 1 : -1
                        body.omega += sign * (offsets[i].x * forceY - offsets[i].y * forceX) / body.inertia * h * strength
                    })
                }
            }
            for (const [i, body] of bodies.entries()) {
                if (body.pinned) continue
                const sign = i === 0 ? 1 : -1
                body.vx += sign * forceX * h * strength
                body.vy += sign * forceY * h * strength
                const exit = 1 - smooth((event.duration - age) / .72)
                const damping = Math.exp(-h * (.42 + exit * 7))
                body.vx *= damping
                body.vy *= damping
                const speed = Math.hypot(body.vx, body.vy)
                if (speed > 1450) { body.vx *= 1450 / speed; body.vy *= 1450 / speed }
                body.x += body.vx * h
                body.y += body.vy * h
                if (exit > 0) {
                    body.exitAngle ??= Math.round(body.angle / TAU) * TAU
                    body.omega += ((body.exitAngle - body.angle) * 65 - body.omega * 15) * h
                } else {
                    body.omega *= Math.exp(-h * .95)
                    body.omega = clamp(body.omega, -10, 10)
                }
                body.angle += body.omega * h
                wall(body, view, h, age)
            }
            if (age > .2) collide(h, strength)
            for (const body of bodies) if (!body.pinned) wall(body, view, h, age)
        }
        for (const body of bodies) {
            body.team.currentX = body.x
            body.team.currentY = body.y
        }
    }

    return {
        update,
        rotation(team) {
            const body = bodies.find(body => body.team === team)
            if (!body) return 0
            // Resolve the final sub-degree remainder during the existing fade-out.
            return renderedAngle(body)
        },
        get collisions() { return hits },
    }
}

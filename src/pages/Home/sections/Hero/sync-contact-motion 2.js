// Collision masks are sampled from the rendered SVG alpha, including holes and
// separate paths. The same constraints also handle travel outside the SYNC window.
export function createArtworkMasks(size, angles, sampleSize = 4) {
    const cache = new WeakMap();
    return (team, image, visual = {}) => {
        if (!image?.complete || !image.naturalWidth) return null;
        let mask = cache.get(image);
        if (!mask) {
            const scale = size / Math.max(image.naturalWidth, image.naturalHeight);
            const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(width / sampleSize);
            canvas.height = Math.ceil(height / sampleSize);
            const context = canvas.getContext('2d', { willReadFrequently: true });
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            const points = [];
            const outlinePoints = [];
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    if (pixels[(y * canvas.width + x) * 4 + 3] > 48) {
                        const point = [(x + 0.5) / canvas.width * width - width / 2,
                        (y + 0.5) / canvas.height * height - height / 2];
                        points.push(point);
                        if (x === 0 || y === 0 || x === canvas.width - 1 || y === canvas.height - 1 ||
                            pixels[(y * canvas.width + x - 1) * 4 + 3] <= 48 ||
                            pixels[(y * canvas.width + x + 1) * 4 + 3] <= 48 ||
                            pixels[((y - 1) * canvas.width + x) * 4 + 3] <= 48 ||
                            pixels[((y + 1) * canvas.width + x) * 4 + 3] <= 48) outlinePoints.push(point);
                    }
                }
            }
            // Consecutive outline spans preserve contact-point order. Their bounds
            // only reject spans that cannot reach the other mask's rectangle.
            const outlineSpans = [];
            for (let start = 0; start < outlinePoints.length; start += 32) {
                const end = Math.min(start + 32, outlinePoints.length);
                let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
                for (let i = start; i < end; i++) {
                    const [x, y] = outlinePoints[i];
                    left = Math.min(left, x); right = Math.max(right, x);
                    top = Math.min(top, y); bottom = Math.max(bottom, y);
                }
                outlineSpans.push({ start, end, x: (left + right) / 2, y: (top + bottom) / 2,
                    halfW: (right - left) / 2, halfH: (bottom - top) / 2 });
            }
            mask = { width, height, outlineSpans, columns: canvas.width, rows: canvas.height, pixels, points, outlinePoints };
            cache.set(image, mask);
        }
        const angle = angles[team.id] * Math.PI / 180 + (visual.angle || 0);
        return {
            ...mask, x: team.currentX + (visual.x || 0), y: team.currentY + (visual.y || 0),
            cos: Math.cos(angle), sin: Math.sin(angle)
        };
    };
}

export function artworkTouches(a, b) {
    return !!artworkContact(a, b);
}

export function artworkContact(a, b) {
    if (!a || !b) return null;
    if (a.parts || b.parts) {
        for (const first of a.parts || [a]) for (const second of b.parts || [b]) {
            const contact = artworkContact(first, second);
            if (contact) return contact;
        }
        return null;
    }
    if (a.solid && !b.solid) return artworkContact(b, a);
    const aw = Math.abs(a.cos) * a.width / 2 + Math.abs(a.sin) * a.height / 2;
    const ah = Math.abs(a.sin) * a.width / 2 + Math.abs(a.cos) * a.height / 2;
    const bw = Math.abs(b.cos) * b.width / 2 + Math.abs(b.sin) * b.height / 2;
    const bh = Math.abs(b.sin) * b.width / 2 + Math.abs(b.cos) * b.height / 2;
    if (Math.abs(a.x - b.x) > aw + bw || Math.abs(a.y - b.y) > ah + bh) return null;
    const points = a.outlinePoints || a.points;
    const relativeCos = a.cos * b.cos + a.sin * b.sin;
    const relativeSin = a.sin * b.cos - a.cos * b.sin;
    let spanIndex = 0;
    for (let i = 0; i < points.length; i++) {
        const span = a.outlineSpans?.[spanIndex];
        if (span && i === span.start) {
            spanIndex++;
            const dx = a.x + span.x * a.cos - span.y * a.sin - b.x;
            const dy = a.y + span.x * a.sin + span.y * a.cos - b.y;
            const cx = dx * b.cos + dy * b.sin;
            const cy = -dx * b.sin + dy * b.cos;
            const halfW = Math.abs(relativeCos) * span.halfW + Math.abs(relativeSin) * span.halfH;
            const halfH = Math.abs(relativeSin) * span.halfW + Math.abs(relativeCos) * span.halfH;
            // Conservative tolerance: exact per-point alpha tests below still
            // determine every contact, including the original first hit.
            if (cx + halfW < -b.width / 2 - 1e-7 || cx - halfW > b.width / 2 + 1e-7 ||
                cy + halfH < -b.height / 2 - 1e-7 || cy - halfH > b.height / 2 + 1e-7) {
                i = span.end - 1;
                continue;
            }
        }
        const [x, y] = points[i];
        const dx = a.x + x * a.cos - y * a.sin - b.x;
        const dy = a.y + x * a.sin + y * a.cos - b.y;
        const u = Math.floor((dx * b.cos + dy * b.sin + b.width / 2) / b.width * b.columns);
        const v = Math.floor((-dx * b.sin + dy * b.cos + b.height / 2) / b.height * b.rows);
        if (u >= 0 && v >= 0 && u < b.columns && v < b.rows &&
            (b.solid || b.pixels[(v * b.columns + u) * 4 + 3] > 48)) {
            return { x: dx + b.x, y: dy + b.y };
        }
    }
    return null;
}

// Integrate the actual team body, independently of the primary SYNC lifetime.
// The engine suspends idle steering and layout separation while this owns it.
export function stepSecondaryRecoil(team, dt) {
    const response = team.contactResponse;
    if (!response) return;
    const steps = Math.max(1, Math.ceil(dt * 120)), h = dt / steps;
    for (let i = 0; i < steps; i++) {
        response.age += h;
        response.homeX += response.idleVX * h;
        response.homeY += response.idleVY * h;
        if (response.phase === 'coast') {
            const drag = Math.exp(-1.8 * h);
            team.velocityX *= drag;
            team.velocityY *= drag;
            response.spin *= Math.exp(-0.9 * h);
            if (Math.hypot(team.velocityX, team.velocityY) <= response.returnSpeed) {
                response.phase = 'return';
            }
        } else {
            // Critical damping returns from the current position and current velocity.
            // There is no timed rewind, position interpolation or velocity reset.
            team.velocityX += ((response.homeX - team.currentX) * 9 -
                (team.velocityX - response.idleVX) * 6) * h;
            team.velocityY += ((response.homeY - team.currentY) * 9 -
                (team.velocityY - response.idleVY) * 6) * h;
            response.spin += (-response.angle * 9 - response.spin * 6) * h;
        }
        team.currentX += team.velocityX * h;
        team.currentY += team.velocityY * h;
        response.angle += response.spin * h;
        if (response.phase === 'return' &&
            Math.hypot(team.currentX - response.homeX, team.currentY - response.homeY) < 0.5 &&
            Math.hypot(team.velocityX - response.idleVX, team.velocityY - response.idleVY) < 1 &&
            Math.abs(response.angle) < 0.002 && Math.abs(response.spin) < 0.005) {
            team.contactResponse = null;
            team.syncResuming = true;
            break;
        }
    }
}

export function createContactMotion({ pair, teams, pose, burst, bounds, protectedArea = () => null, random = Math.random }) {
    const bodies = pair.map((team) => ({ team, vx: 0, vy: 0, angle: 0, spin: 0 }));
    const responses = new Map();
    const secondaryContacts = new Set();
    const previous = new Map();
    const constrainedTeams = new Set();
    let clock = 0, lastImpact = -10, touching = false, impactCount = 0;
    let driftAngle = random() * Math.PI * 2;
    const visual = (team) => {
        const primary = bodies.find((body) => body.team === team);
        if (primary) return primary;
        const response = team.contactResponse || team.contactRecovery;
        if (!response) return null;
        return response;
    };
    const primaryBodies = new Set(bodies);
    let driven = () => false, ignored = () => false;
    const drivenVelocity = new Map();
    const allBodies = teams.map(team => bodies.find(body => body.team === team) || {
        team,
        get vx() { return drivenVelocity.get(team)?.x ?? (team.velocityX || 0); },
        set vx(value) { if (!driven(team)) team.velocityX = value; },
        get vy() { return drivenVelocity.get(team)?.y ?? (team.velocityY || 0); },
        set vy(value) { if (!driven(team)) team.velocityY = value; }
    });
    let constraintShapes = null;
    const shape = (body, precise = false, painted = false) => {
        if (body.fixed) return body.mask;
        if (constraintShapes && precise && painted && constraintShapes.has(body)) return constraintShapes.get(body);
        const mask = pose(body.team, primaryBodies.has(body) ? body : visual(body.team) || {}, precise, painted);
        if (constraintShapes && precise && painted) constraintShapes.set(body, mask);
        return mask;
    };

    function shifted(mask, dx, dy) {
        return {
            ...mask, x: mask.x + dx, y: mask.y + dy,
            ...(mask.parts ? { parts: mask.parts.map(part => shifted(part, dx, dy)) } : {})
        };
    }

    function capture() {
        for (const team of teams) {
            if (pair.includes(team)) continue;
            previous.set(team, {
                x: team.currentX, y: team.currentY,
                angle: visual(team)?.angle || 0, response: team.contactResponse,
                visual: visual(team), offsetX: visual(team)?.x || 0, offsetY: visual(team)?.y || 0
            });
        }
    }

    function secondaryContact(body, team) {
        const a = shape(body, true), b = pose(team, visual(team) || {}, true);
        return artworkContact(a, b) || artworkContact(b, a);
    }

    function secondarySeparated(body, team) {
        const a = shape(body, true), b = pose(team, visual(team) || {}, true);
        if (!a || !b) return false;
        // Keep the contact latched across the solver's 0.05px clearance and
        // mask sampling noise. Only a real gap rearms this particular pair.
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const nearby = shifted(b, Math.cos(angle) * 2, Math.sin(angle) * 2);
            if (artworkContact(a, nearby) || artworkContact(nearby, a)) return false;
        }
        return true;
    }

    function separateSecondary(body, team) {
        return separateBodies(body, allBodies.find(other => other.team === team));
    }

    function separateBodies(body, other) {
        if (!other.fixed && ignored(body.team, other.team)) return false;
        const a = shape(body, true, true), b = shape(other, true, true);
        if (!a || !b || !(artworkContact(a, b) || artworkContact(b, a))) return false;
        let nx = b.x - a.x, ny = b.y - a.y;
        const length = Math.hypot(nx, ny);
        if (length > 0.001) { nx /= length; ny /= length; }
        else { nx = 1; ny = 0; }
        if (!other.fixed && driven(body.team) !== driven(other.team)) {
            const driver = driven(body.team) ? body : other;
            const free = driver === body ? other : body;
            const freeMask = driver === body ? b : a;
            const pushSign = driver === body ? 1 : -1;
            const nextMask = shifted(freeMask, nx * 2 * pushSign, ny * 2 * pushSign);
            const secondDriver = allBodies.find(candidate => candidate !== driver && driven(candidate.team) &&
                (artworkContact(nextMask, shape(candidate, true, true)) ||
                    artworkContact(shape(candidate, true, true), nextMask)));
            if (secondDriver) {
                // A body squeezed between the approaching pair must leave the
                // corridor sideways, rather than oscillate between two drivers.
                const sx = secondDriver.team.currentX - driver.team.currentX;
                const sy = secondDriver.team.currentY - driver.team.currentY;
                const span = Math.hypot(sx, sy) || 1;
                const side = Math.sign(-sy * (free.team.currentX - driver.team.currentX) +
                    sx * (free.team.currentY - driver.team.currentY)) || 1;
                const direction = driver === body ? side : -side;
                nx = -sy / span * direction; ny = sx / span * direction;
            }
        }
        // Painted area is the body mass estimate; both bodies share correction.
        const massA = Math.max(1, a.mass || a.points.length), massB = Math.max(1, b.mass || b.points.length);
        const shareA = other.fixed || driven(other.team) ? 1 : driven(body.team) ? 0 : massB / (massA + massB);
        const shareB = 1 - shareA;
        function overlaps(distance) {
            const movedA = shifted(a, -nx * distance * shareA, -ny * distance * shareA);
            const movedB = shifted(b, nx * distance * shareB, ny * distance * shareB);
            return artworkContact(movedA, movedB) || artworkContact(movedB, movedA);
        }
        // Find the first clear position along the contact normal, then refine it.
        // No orbit radius or enclosing circle participates in this solve.
        let low = 0, high = 1;
        const limit = a.width + a.height + b.width + b.height;
        while (high < limit && overlaps(high)) { low = high; high += 2; }
        for (let i = 0; i < 9; i++) {
            const mid = (low + high) / 2;
            if (overlaps(mid)) low = mid; else high = mid;
        }
        const correction = high + 0.05;
        if (!primaryBodies.has(body)) constrainedTeams.add(body.team);
        if (!other.fixed && !primaryBodies.has(other)) constrainedTeams.add(other.team);
        body.team.currentX -= nx * correction * shareA;
        body.team.currentY -= ny * correction * shareA;
        if (!other.fixed) {
            other.team.currentX += nx * correction * shareB;
            other.team.currentY += ny * correction * shareB;
        }
        // Only corrected bodies changed pose during this constraint pass.
        constraintShapes?.delete(body);
        constraintShapes?.delete(other);
        // Remove only inward normal velocity. Tangential travel and spin survive.
        const closing = (other.vx - body.vx) * nx + (other.vy - body.vy) * ny;
        if (closing < 0) {
            const speed = Math.hypot(body.vx, body.vy);
            const impulse = closing * (other.fixed ? 1 : 1.15);
            body.vx += nx * impulse * shareA;
            body.vy += ny * impulse * shareA;
            if (!other.fixed) {
                other.vx -= nx * impulse * shareB;
                other.vy -= ny * impulse * shareB;
            } else {
                // Slide around the protected title with the incoming momentum,
                // rather than stopping head-on while attraction keeps pushing.
                const tangent = -ny * body.vx + nx * body.vy;
                const sign = Math.abs(tangent) > 0.01 ? Math.sign(tangent)
                    : Math.sign(body.spin || body.team.contactResponse?.spin || 1);
                const extra = Math.max(0, speed * 0.9 - Math.abs(tangent));
                body.vx -= ny * sign * extra;
                body.vy += nx * sign * extra;
            }
        }
        return true;
    }

    function finalize(force = false) {
        if (!impactCount && !force) return;
        // Other bodies retain their exact painted pose across pair checks.
        constraintShapes = new Map();
        const box = protectedArea();
        const obstacle = box && {
            fixed: true, vx: 0, vy: 0, mask: {
                x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2,
                width: box.right - box.left, height: box.bottom - box.top,
                cos: 1, sin: 0, columns: 1, rows: 1, solid: true, points: [[0, 0]]
            }
        };
        // All 28 pairs, including ordinary/ordinary and a still-touching primary
        // pair. Effects remain exclusively in the existing impact handlers.
        for (let pass = 0; pass < 24; pass++) {
            let changed = false;
            for (let i = 0; i < allBodies.length; i++) {
                if (obstacle && separateBodies(allBodies[i], obstacle)) changed = true;
                for (let j = i + 1; j < allBodies.length; j++) {
                    if (separateBodies(allBodies[i], allBodies[j])) changed = true;
                }
            }
            if (!changed) break;
        }
        constraintShapes = null;
    }

    // Reuse the same mask constraints for externally integrated motion: drag,
    // the initial approach and recoil continuing after the SYNC window closes.
    // No attraction, spin integration or particle emission runs in this path.
    function sweep(dt, options = {}) {
        constrainedTeams.clear();
        driven = options.driven || (() => false);
        ignored = options.ignore || (() => false);
        const travel = teams.map(team => {
            const v = visual(team);
            const from = previous.get(team) || {
                x: team.currentX, y: team.currentY,
                angle: v?.angle || 0, offsetX: v?.x || 0, offsetY: v?.y || 0
            };
            const move = {
                team, from, v, dx: team.currentX - from.x, dy: team.currentY - from.y,
                angle: v?.angle || 0, offsetX: v?.x || 0, offsetY: v?.y || 0
            };
            team.currentX = from.x; team.currentY = from.y;
            if (driven(team)) drivenVelocity.set(team, { x: dt > 0 ? move.dx / dt : 0, y: dt > 0 ? move.dy / dt : 0 });
            return move;
        });
        const maxTravel = Math.max(0, ...travel.map(move => Math.hypot(move.dx, move.dy) +
            Math.hypot(move.offsetX - move.from.offsetX, move.offsetY - move.from.offsetY) +
            Math.abs(move.angle - move.from.angle) * 285));
        const steps = Math.max(1, Math.ceil(dt * 120), Math.ceil(maxTravel / 1.5)), h = dt / steps;
        for (let n = 0; n < steps; n++) {
            for (const move of travel) {
                const constrained = constrainedTeams.has(move.team) && !driven(move.team);
                move.team.currentX += constrained ? (move.team.velocityX || 0) * h : move.dx / steps;
                move.team.currentY += constrained ? (move.team.velocityY || 0) * h : move.dy / steps;
                if (move.v) {
                    const progress = (n + 1) / steps;
                    move.v.angle = move.from.angle + (move.angle - move.from.angle) * progress;
                    move.v.x = move.from.offsetX + (move.offsetX - move.from.offsetX) * progress;
                    move.v.y = move.from.offsetY + (move.offsetY - move.from.offsetY) * progress;
                }
            }
            finalize(true);
        }
        driven = () => false; ignored = () => false; drivenVelocity.clear();
        capture();
    }

    function impact(a, b, nx, ny) {
        impactCount++;
        lastImpact = clock;
        const turn = (random() - 0.5) * 0.95;
        const dx = nx * Math.cos(turn) - ny * Math.sin(turn);
        const dy = nx * Math.sin(turn) + ny * Math.cos(turn);
        driftAngle += 1.1 + random() * 1.9;
        const driftX = Math.cos(driftAngle) * 170, driftY = Math.sin(driftAngle) * 170;
        const speed = 490 + random() * 120;
        a.vx = -dx * speed + driftX;
        a.vy = -dy * speed + driftY;
        b.vx = dx * speed + driftX;
        b.vy = dy * speed + driftY;
        const sign = impactCount % 2 ? 1 : -1;
        a.spin = sign * (1.7 + random() * 1.3);
        b.spin = -sign * (2.1 + random() * 1.5);
        burst(a.team, a);
        burst(b.team, b);
    }

    function step(dt) {
        constrainedTeams.clear();
        const travel = [];
        let maxTravel = 0;
        for (const team of teams) {
            if (pair.includes(team)) continue;
            const from = previous.get(team) || {
                x: team.currentX, y: team.currentY,
                angle: visual(team)?.angle || 0, response: team.contactResponse
            };
            const angle = visual(team)?.angle || 0;
            const dx = team.currentX - from.x, dy = team.currentY - from.y;
            travel.push({ team, from, dx, dy, angle });
            maxTravel = Math.max(maxTravel, Math.hypot(dx, dy) + Math.abs(angle - from.angle) * 285);
            team.currentX = from.x; team.currentY = from.y;
            if (team.contactResponse === from.response && team.contactResponse) team.contactResponse.angle = from.angle;
        }
        for (const body of bodies) {
            maxTravel = Math.max(maxTravel, (Math.hypot(body.vx, body.vy) + Math.abs(body.spin) * 285 + 950 * dt) * dt);
        }
        // Sweep translation AND rotated artwork edges at <=1.5px per substep.
        const steps = Math.max(1, Math.ceil(dt * 120), Math.ceil(maxTravel / 1.5)), h = dt / steps;
        for (let n = 0; n < steps; n++) {
            clock += h;
            for (const move of travel) {
                if (constrainedTeams.has(move.team)) {
                    move.team.currentX += (move.team.velocityX || 0) * h;
                    move.team.currentY += (move.team.velocityY || 0) * h;
                } else {
                    move.team.currentX += move.dx / steps;
                    move.team.currentY += move.dy / steps;
                }
                if (move.team.contactResponse === move.from.response && move.team.contactResponse) {
                    move.team.contactResponse.angle = move.from.angle +
                        (move.angle - move.from.angle) * (n + 1) / steps;
                }
            }
            for (const team of responses.keys()) {
                if (!team.contactResponse) responses.delete(team);
            }
            const [a, b] = bodies;
            const dx = b.team.currentX - a.team.currentX, dy = b.team.currentY - a.team.currentY;
            const distance = Math.hypot(dx, dy) || 1, nx = dx / distance, ny = dy / distance;
            const since = clock - lastImpact;
            const pull = since < 0.32 ? 0 : 950;
            a.vx += nx * pull * h; a.vy += ny * pull * h;
            b.vx -= nx * pull * h; b.vy -= ny * pull * h;
            for (const body of bodies) {
                const speed = Math.hypot(body.vx, body.vy);
                if (speed > 900) { body.vx *= 900 / speed; body.vy *= 900 / speed; }
                body.team.currentX += body.vx * h;
                body.team.currentY += body.vy * h;
                body.angle += body.spin * h;
                const mask = shape(body), area = bounds();
                if (!mask) continue;
                const halfW = (Math.abs(mask.cos) * mask.width + Math.abs(mask.sin) * mask.height) / 2;
                const halfH = (Math.abs(mask.sin) * mask.width + Math.abs(mask.cos) * mask.height) / 2;
                const lowX = Math.min(halfW + 12, area.width / 2), highX = Math.max(lowX, area.width - halfW - 12);
                const lowY = Math.min(halfH + 12, area.height / 2), highY = Math.max(lowY, area.height - halfH - 12);
                if (body.team.currentX < lowX || body.team.currentX > highX) {
                    body.team.currentX = Math.max(lowX, Math.min(highX, body.team.currentX));
                    body.vx = body.team.currentX === lowX ? Math.abs(body.vx) : -Math.abs(body.vx);
                }
                if (body.team.currentY < lowY || body.team.currentY > highY) {
                    body.team.currentY = Math.max(lowY, Math.min(highY, body.team.currentY));
                    body.vy = body.team.currentY === lowY ? Math.abs(body.vy) : -Math.abs(body.vy);
                }
            }
            const contact = !!(artworkContact(shape(a, true), shape(b, true)) || artworkContact(shape(b, true), shape(a, true)));
            if (contact && !touching && since > 0.2) {
                impact(a, b, nx, ny);
                // Resolve penetration using the same painted masks, never orbit radii.
                separateBodies(a, b);
            }
            touching = contact;
            // Preserve the intended first contact, but clear ordinary artwork
            // from the approach path without deflecting either SYNC participant.
            if (!impactCount) {
                driven = team => pair.includes(team);
                ignored = (first, second) => pair.includes(first) && pair.includes(second);
                finalize(true);
                driven = () => false; ignored = () => false;
                continue;
            }
            for (const body of bodies) {
                for (const team of teams) {
                    if (pair.includes(team)) continue;
                    const key = body.team.id + ':' + team.id;
                    const targetVisual = visual(team) || {};
                    const targetShape = pose(team, targetVisual);
                    const contactPoint = secondaryContact(body, team);
                    if (!contactPoint) {
                        if (secondaryContacts.has(key) && secondarySeparated(body, team)) secondaryContacts.delete(key);
                        continue;
                    }
                    if (secondaryContacts.has(key)) {
                        separateSecondary(body, team);
                        continue;
                    }
                    secondaryContacts.add(key);
                    const dx = targetShape.x - body.team.currentX, dy = targetShape.y - body.team.currentY;
                    const length = Math.hypot(dx, dy) || 1;
                    const kickSpeed = Math.max(680, Math.min(900, Math.hypot(body.vx, body.vy) * 1.15));
                    const previousResponse = team.contactResponse;
                    const idleVX = previousResponse?.idleVX ?? (team.velocityX || 0);
                    const idleVY = previousResponse?.idleVY ?? (team.velocityY || 0);
                    const response = {
                        x: 0, y: 0, phase: 'coast', idleVX, idleVY,
                        returnSpeed: Math.max(90, Math.hypot(idleVX, idleVY) * 4),
                        homeX: previousResponse?.homeX ?? team.currentX,
                        homeY: previousResponse?.homeY ?? team.currentY,
                        angle: targetVisual.angle || 0,
                        spin: -Math.sign(body.spin || 1) * 3.8, age: 0, otherId: body.team.id
                    };
                    team.velocityX = idleVX + dx / length * kickSpeed;
                    team.velocityY = idleVY + dy / length * kickSpeed;
                    team.contactResponse = response;
                    constrainedTeams.add(team);
                    responses.set(team, response);
                    // A secondary collision has one emitter at the painted contact,
                    // captured before the target changes SVG or receives its impulse.
                    burst(team, { x: contactPoint.x - team.currentX, y: contactPoint.y - team.currentY }, {
                        direction: Math.atan2(dy, dx),
                        strength: Math.max(0.75, Math.min(1.35, Math.hypot(body.vx, body.vy) / 650))
                    });
                    body.vx -= dx / length * 35;
                    body.vy -= dy / length * 35;
                    separateSecondary(body, team);
                }
            }
            // A correction against one primary can create contact with the other.
            // Finish the constraints before rendering, even for an active response.
            finalize();
        }
        capture();
    }
    capture();
    return { step, sweep, visual, capture, finalize, get impactCount() { return impactCount; } };
}

function createParticleEmitter(random = Math.random) {
    const particles = [];
    const colors = ['#FD00A0', '#5F50D8', '#009DEB', '#00BFA3', '#F7A600'];
    return {
        burst(team, visual = {}, impact = null) {
            const radius = team.outerRadius || 250;
            const count = 35;
            // 80% magenta, shuffled independently of direction and travel distance.
            const palette = Array.from({ length: count }, (_, i) => i < count * 0.8 ? colors[0]
                : colors[1 + Math.floor(random() * (colors.length - 1))]);
            for (let i = palette.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [palette[i], palette[j]] = [palette[j], palette[i]];
            }
            for (let i = 0; i < count; i++) {
                const angle = random() * Math.PI * 2;
                const distance = radius * (0.3 + Math.pow(random(), 0.65) * 1.05);
                const life = 0.5 + random() * 0.65;
                const drag = 1.4 + random() * 3.8;
                particles.push({
                    x: team.currentX + (visual.x || 0), y: team.currentY + (visual.y || 0),
                    distance, direction: angle, drag,
                    speed: distance * drag / (1 - Math.exp(-drag * life)),
                    biasX: impact ? Math.cos(impact.direction) * radius * 0.28 * impact.strength : 0,
                    biasY: impact ? Math.sin(impact.direction) * radius * 0.28 * impact.strength : 0,
                    age: 0, life, size: 7 + random() * 6,
                    shape: Math.floor(random() * 4), angle: random() * Math.PI,
                    spin: (random() - 0.5) * 7, color: palette[i]
                });
            }
        },
        draw(ctx, camera, dt) {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.age += dt;
                if (p.age >= p.life) { particles.splice(i, 1); continue; }
                const progress = p.age / p.life;
                // Independent launch speed, drag, range and lifetime avoid a ring edge.
                const distance = p.speed / p.drag * (1 - Math.exp(-p.drag * p.age));
                const biasProgress = 1 - Math.pow(1 - progress, 3);
                const fade = Math.max(0, Math.min(1, (1 - progress) / 0.45));
                ctx.save();
                ctx.translate(p.x + Math.cos(p.direction) * distance + p.biasX * biasProgress - camera.x,
                    p.y + Math.sin(p.direction) * distance + p.biasY * biasProgress - camera.y);
                ctx.rotate(p.angle + p.age * p.spin);
                ctx.globalAlpha = fade;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                if (p.shape === 0) {
                    const s = p.size;
                    const h = Math.sqrt(3) * s / 2;

                    ctx.moveTo(-s * 0.2, -h * 0.65);
                    ctx.quadraticCurveTo(0, -h * 1.15, s * 0.2, -h * 0.65);

                    ctx.lineTo(s * 0.78, h * 0.55);
                    ctx.quadraticCurveTo(s * 1.05, h, s * 0.55, h);

                    ctx.lineTo(-s * 0.55, h);
                    ctx.quadraticCurveTo(-s * 1.05, h, -s * 0.78, h * 0.55);

                    ctx.closePath();
                } else if (p.shape === 1) {
                    ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size, p.size * 0.17);
                } else if (p.shape === 2) {
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                } else {
                    const s = p.size;
                    ctx.moveTo(-s * 0.08, -s * 0.9);
                    ctx.quadraticCurveTo(0, -s * 1.1, s * 0.08, -s * 0.9);
                    ctx.bezierCurveTo(s * 0.18, -s * 0.42, s * 0.42, -s * 0.18, s * 0.9, -s * 0.08);
                    ctx.quadraticCurveTo(s * 1.1, 0, s * 0.9, s * 0.08);
                    ctx.bezierCurveTo(s * 0.42, s * 0.18, s * 0.18, s * 0.42, s * 0.08, s * 0.9);
                    ctx.quadraticCurveTo(0, s * 1.1, -s * 0.08, s * 0.9);
                    ctx.bezierCurveTo(-s * 0.18, s * 0.42, -s * 0.42, s * 0.18, -s * 0.9, s * 0.08);
                    ctx.quadraticCurveTo(-s * 1.1, 0, -s * 0.9, -s * 0.08);
                    ctx.bezierCurveTo(-s * 0.42, -s * 0.18, -s * 0.18, -s * 0.42, -s * 0.08, -s * 0.9);
                    ctx.closePath();
                }
                ctx.fill(); ctx.restore();
            }
        },
    };
}

function createHaloEmitter(random = Math.random) {
    const blooms = [];
    const TAU = Math.PI * 2;
    const clamp = v => Math.max(0, Math.min(1, v));
    const ease = t => 1 - Math.pow(1 - clamp(t), 3);

    function filament(ctx, x, y, r, seed, time, layer) {
        const count = 112;
        ctx.beginPath();
        for (let i = 0; i <= count; i++) {
            const a = i / count * TAU;
            const n = Math.sin(a * 7 + seed + time * 1.8) * .032
                + Math.sin(a * 15 - seed * 1.4 - time * 2.4) * .020
                + Math.sin(a * 29 + seed * 2.2 + time * 3.1) * .009;
            const rr = r * (1 + n + layer * .016);
            const px = x + Math.cos(a) * rr;
            const py = y + Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
    }
    return {
        burst(team, visual = {}, impact = null) {
            blooms.push({
                x: team.currentX + (visual.x || 0),
                y: team.currentY + (visual.y || 0),
                radius: team.outerRadius || 250,
                age: 0, life: .83,
                seed: random() * TAU,
                strength: Math.min(1.2, Math.max(.75, impact?.strength ?? 1))
            });
        },
        draw(ctx, camera, dt) {
            for (let i = blooms.length - 1; i >= 0; i--) {
                const b = blooms[i];
                b.age += Math.max(0, dt);
                if (b.age >= b.life) { blooms.splice(i, 1); continue; }
                const t = clamp(b.age / b.life);
                const enter = clamp(t / .075);
                const fade = Math.pow(1 - t, 1.65);
                const power = enter * fade * b.strength;
                const r = b.radius * (.18 + ease(t) * 1.30);
                const x = b.x - camera.x, y = b.y - camera.y;
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                // Diffuse luminous atmosphere, not a solid pink disc.
                const ambient = ctx.createRadialGradient(x, y, r * .12, x, y, r * 1.35);
                ambient.addColorStop(0, `rgba(255,198,237,${.14 * power})`);
                ambient.addColorStop(.34, `rgba(255,88,195,${.095 * power})`);
                ambient.addColorStop(.68, `rgba(253,0,160,${.065 * power})`);
                ambient.addColorStop(1, 'rgba(253,0,160,0)');
                ctx.fillStyle = ambient;
                ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, TAU); ctx.fill();

                // One broad, feathered wavefront. Fine translucent threads
                // supply the organic electric texture without obvious spokes.
                for (let layer = 0; layer < 13; layer++) {
                    const spread = (layer - 6) / 6;
                    const rr = r * (1 + spread * .105);
                    filament(ctx, x, y, rr, b.seed + layer * .37, b.age, spread);
                    ctx.strokeStyle = `rgba(${layer % 3 === 0 ? '255,194,235' : '253,37,179'},${power * (.038 + .035 * (1 - Math.abs(spread)))})`;
                    ctx.lineWidth = Math.max(1.1, r * (.013 + .011 * (1 - Math.abs(spread))));
                    ctx.shadowColor = '#FD00A0';
                    ctx.shadowBlur = Math.max(8, r * .075);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
                // A restrained pearlescent edge flashes at impact then melts.
                filament(ctx, x, y, r * .98, b.seed, b.age, 0);
                ctx.strokeStyle = `rgba(255,205,241,${power * .23})`;
                ctx.lineWidth = Math.max(1, r * .009);
                ctx.stroke();
                ctx.restore();
            }
        }
    };
}


// Keep the original emitters intact. One random style is selected per SYNC,
// so repeated contacts in that SYNC use the same visual treatment.
export function createContactParticles(random = Math.random) {
    const particle = createParticleEmitter(random);
    const halo = createHaloEmitter(random);
    let current = particle;
    return {
        selectRandomInteraction() {
            current = random() < 0.5 ? particle : halo;
        },
        burst(team, visual = {}, impact = null) {
            current.burst(team, visual, impact);
        },
        draw(ctx, camera, dt) {
            // Both queues keep rendering while a previous effect fades out.
            particle.draw(ctx, camera, dt);
            halo.draw(ctx, camera, dt);
        }
    };
}

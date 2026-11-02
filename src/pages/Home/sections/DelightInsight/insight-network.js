// Network-only extraction from Hero/type-engine.js. No typography, camera motion,
// dragging, SYNC, pulses, particles or glow are initialized here.
export default function startInsightNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    const camera = { x: 0, y: 0 };
    const connections = new Map();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let W = 1024, H = 614, frame = null, visible = false, lastTime = null, time = 8;
    const seeded = (index, salt) => {
        const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
        return value - Math.floor(value);
    };
    // Independent fixed anchors keep the network spread across the panel. Only
    // each dot follows Hero's orbit/drift equations; the field never rotates.
    const nodes = Array.from({ length: 38 }, (_, idx) => {
        const radius = 25 + seeded(idx + 1, 32) * 55;
        return {
            idx, team: idx % 8,
            anchorX: seeded(idx + 1, 41), anchorY: seeded(idx + 1, 42),
            x: 0, y: 0, r: 2 + seeded(idx + 1, 7) * 2,
            minRadius: radius - 6, maxRadius: radius + 6, homeRadius: radius,
            orbitAngle: seeded(idx + 1, 31) * Math.PI * 2,
            orbitSpeed: 0.09 + seeded(idx + 1, 20) * 0.09,
            orbitDirection: seeded(idx + 1, 21) < 0.70 ? 1 : -1,
            driftPhase: seeded(idx + 1, 10) * Math.PI * 2,
            driftSpeed: 0.10 + seeded(idx + 1, 11) * 0.09,
            driftAmount: 2.5 + seeded(idx + 1, 18) * 3.5,
            angularDrift: 0.016 + seeded(idx + 1, 19) * 0.024,
        };
    });
    function updateNodeMotion(n, dt, t) {
        const motionFactor = motionQuery.matches ? 0.12 : 1;
        n.orbitAngle += n.orbitSpeed * n.orbitDirection * dt * motionFactor;
        const angularOffset = Math.sin(t * n.driftSpeed + n.driftPhase) * n.angularDrift * motionFactor;
        const radialOffset = Math.sin(t * (n.driftSpeed * 0.73) + n.driftPhase * 1.7) * n.driftAmount * motionFactor;
        const radius = Math.max(n.minRadius, Math.min(n.maxRadius, n.homeRadius + radialOffset));
        const angle = n.orbitAngle + angularOffset;
        const driftX = Math.sin(t * 0.14 + n.driftPhase * 2.1) * n.driftAmount * 0.45 * motionFactor;
        const driftY = Math.cos(t * 0.12 + n.driftPhase * 1.3) * n.driftAmount * 0.40 * motionFactor;
        const margin = 0;
        n.x = margin + n.anchorX * Math.max(0, W - margin * 2) + Math.cos(angle) * radius + driftX;
        n.y = margin + n.anchorY * Math.max(0, H - margin * 2) + Math.sin(angle) * radius + driftY;
    }
    function findCandidate(candidates, nodeIndex) {
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i].node.idx === nodeIndex) return candidates[i];
        }
        return null;
    }

    function selectStableCandidates(node, candidates, t) {
        if (!node.connectionSlots) {
            node.connectionSlots = [
                { target: null, changedAt: -999 },
                { target: null, changedAt: -999 },
                { target: null, changedAt: -999 }
            ];
        }

        var selected = [];
        var used = {};
        for (var slotIndex = 0; slotIndex < node.connectionSlots.length; slotIndex++) {
            var slot = node.connectionSlots[slotIndex];
            var incumbent = slot.target === null ? null : findCandidate(candidates, slot.target);
            if (incumbent && used[incumbent.node.idx]) incumbent = null;

            var challenger = null;
            for (var candidateIndex = 0; candidateIndex < candidates.length; candidateIndex++) {
                if (!used[candidates[candidateIndex].node.idx]) {
                    challenger = candidates[candidateIndex];
                    break;
                }
            }

            var chosen = incumbent || challenger;
            if (incumbent && challenger && challenger.node.idx !== incumbent.node.idx &&
                t - slot.changedAt > 3.0 && challenger.score < incumbent.score - 78) {
                chosen = challenger;
            }

            if (chosen) {
                if (slot.target !== chosen.node.idx) {
                    slot.target = chosen.node.idx;
                    slot.changedAt = t;
                }
                used[chosen.node.idx] = true;
                selected.push(chosen);
            } else {
                slot.target = null;
            }
        }
        return selected;
    }

    function activateConnection(a, candidate, t, maxDistance) {
        var b = candidate.node;
        var key = Math.min(a.idx, b.idx) + ':' + Math.max(a.idx, b.idx);
        var connection = connections.get(key);
        if (!connection) {
            var seed = a.idx * 0.61 + b.idx;
            connection = {
                a: a,
                b: b,
                alpha: 0,
                targetAlpha: 1,
                progress: 0,
                progressDuration: 0.55 + seeded(a.idx + b.idx + 1, 61) * 0.55,
                tension: 0,
                strength: 0,
                targetStrength: 0,
                controlX: (a.x + b.x) * 0.5,
                controlY: (a.y + b.y) * 0.5,
                velocityX: 0,
                velocityY: 0,
                curveSign: seeded(a.idx + b.idx + 1, 62) < 0.5 ? -1 : 1,
                seed: seed,
                lastSeen: t
            };
            connections.set(key, connection);
        } else if (connection.alpha < 0.04) {
            connection.progress = 0;
        }

        var proximity = 1 - Math.min(1, candidate.distance / maxDistance);
        connection.targetAlpha = 1;
        connection.targetStrength = 0.28 + proximity * 0.50;
        connection.lastSeen = t;
    }

    function updateAndDrawConnections(t, dt, maxDistance) {
        connections.forEach(function (connection, key) {
            var a = connection.a;
            var b = connection.b;
            var dx = b.x - a.x;
            var dy = b.y - a.y;
            var distance = Math.hypot(dx, dy) || 1;
            var isDragged = false;
            var normalizedTension = Math.max(0, Math.min(1, (distance - 150) / Math.max(1, maxDistance - 150)));
            if (isDragged) normalizedTension = Math.min(1, normalizedTension + 0.14);
            if (connection.targetAlpha === 0) normalizedTension = 0;

            var alphaSpeed = connection.targetAlpha > connection.alpha ? 6.0 : 2.1;
            connection.alpha += (connection.targetAlpha - connection.alpha) * Math.min(1, dt * alphaSpeed);
            connection.strength += (connection.targetStrength - connection.strength) * Math.min(1, dt * 5.0);
            var tensionSpeed = connection.targetAlpha > 0 ? 3.8 : 1.7;
            connection.tension += (normalizedTension - connection.tension) * Math.min(1, dt * tensionSpeed);
            if (connection.targetAlpha > 0 && connection.progress < 1) {
                connection.progress = Math.min(1, connection.progress + dt / connection.progressDuration);
            }

            var midpointX = (a.x + b.x) * 0.5;
            var midpointY = (a.y + b.y) * 0.5;
            var normalX = -dy / distance;
            var normalY = dx / distance;
            var releaseSlack = connection.targetAlpha === 0 ? 0.018 : 0;
            var curveRatio = 0.012 + (1 - connection.tension) * 0.050 + releaseSlack;
            var subtleMotion = 0.86 + Math.sin(t * 0.32 + connection.seed) * 0.14;
            var curveAmount = distance * curveRatio * subtleMotion * connection.curveSign;
            var desiredControlX = midpointX + normalX * curveAmount;
            var desiredControlY = midpointY + normalY * curveAmount;

            var spring = isDragged ? 30 : 42;
            var damping = isDragged ? 8.0 : 10.5;
            connection.velocityX += (desiredControlX - connection.controlX) * spring * dt;
            connection.velocityY += (desiredControlY - connection.controlY) * spring * dt;
            var dampingFactor = Math.exp(-damping * dt);
            connection.velocityX *= dampingFactor;
            connection.velocityY *= dampingFactor;
            connection.controlX += connection.velocityX * dt;
            connection.controlY += connection.velocityY * dt;

            var easedProgress = 1 - Math.pow(1 - connection.progress, 3);
            var ax = a.x - camera.x;
            var ay = a.y - camera.y;
            var endX = a.x + dx * easedProgress - camera.x;
            var endY = a.y + dy * easedProgress - camera.y;
            var controlX = a.x + (connection.controlX - a.x) * easedProgress - camera.x;
            var controlY = a.y + (connection.controlY - a.y) * easedProgress - camera.y;
            var finalAlpha = (0.13 + 0.15 * connection.tension) * connection.strength * connection.alpha;

            if (connection.alpha > 0.002 && easedProgress > 0.002) {
                ctx.save();
                ctx.lineWidth = 0.55 + 0.45 * connection.tension + (isDragged ? 0.06 : 0);
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgba(150,150,150,' + Math.max(0, finalAlpha * 1.4).toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.quadraticCurveTo(controlX, controlY, endX, endY);
                ctx.stroke();
                ctx.restore();
            }

            if (connection.targetAlpha === 0 && connection.alpha < 0.004) {
                connections.delete(key);
            }
        });
    }

    function drawEdges(t, dt) {
        var maxDistance = Math.max(400, Math.min(680, Math.min(W, H) * 0.86));

        connections.forEach(function (connection) {
            connection.targetAlpha = 0;
            connection.targetStrength = connection.strength;
        });

        for (var i = 0; i < nodes.length; i++) {
            var a = nodes[i];
            var ax = a.x - camera.x;
            var ay = a.y - camera.y;
            if (ax < -maxDistance || ax > W + maxDistance || ay < -maxDistance || ay > H + maxDistance) continue;

            var candidates = [];
            for (var j = 0; j < nodes.length; j++) {
                if (i === j) continue;
                var b = nodes[j];
                var distance = Math.hypot(b.x - a.x, b.y - a.y);
                if (distance > maxDistance) continue;
                var changingBias = Math.sin(t * 0.52 + i * 1.73 + j * 0.91) * 72;
                candidates.push({ node: b, distance: distance, score: distance + changingBias });
            }
            candidates.sort(function (left, right) { return left.score - right.score; });

            var selected = selectStableCandidates(a, candidates, t);
            var bridgePhase = Math.floor(t / 4) % 5;
            if (i % 5 === bridgePhase) {
                for (var bridgeIndex = 0; bridgeIndex < candidates.length; bridgeIndex++) {
                    if (candidates[bridgeIndex].node.team !== a.team) {
                        selected.push(candidates[bridgeIndex]);
                        break;
                    }
                }
            }

            for (var k = 0; k < selected.length; k++) {
                activateConnection(a, selected[k], t, maxDistance);
            }
        }

        updateAndDrawConnections(t, dt, maxDistance);
    }


    function draw(dt) {
        ctx.clearRect(0, 0, W, H);
        nodes.forEach(node => updateNodeMotion(node, dt, time));
        drawEdges(time, dt);
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(175,175,175,0.52)';
            ctx.fill();
        });
    }
    function resize() {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        // Reference-space sizing preserves density on larger desktop screens.
        W = 1024;
        H = height / width * W;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
        // Discard control points from the previous aspect ratio so resizing
        // cannot leave stretched curves spanning outside the panel.
        connections.clear();
        nodes.forEach(node => { delete node.connectionSlots; });
        draw(0);
        connections.forEach(connection => {
            connection.alpha = 1;
            connection.progress = 1;
            connection.strength = connection.targetStrength;
        });
        draw(0);
    }
    function animate(timestamp) {
        frame = null;
        if (!visible || document.hidden) return;
        const dt = lastTime === null ? 1 / 60 : Math.min((timestamp - lastTime) / 1000, 0.033);
        lastTime = timestamp;
        time += dt;
        draw(dt);
        frame = requestAnimationFrame(animate);
    }
    function stop() {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        lastTime = null;
    }
    function start() {
        if (frame === null && visible && !document.hidden) frame = requestAnimationFrame(animate);
    }
    const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
    });
    const sizeObserver = new ResizeObserver(resize);
    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };
    resize();
    sizeObserver.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
        stop();
        intersection.disconnect();
        sizeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
    };
}

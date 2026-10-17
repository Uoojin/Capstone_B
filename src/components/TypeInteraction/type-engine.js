/* eslint-disable no-unused-vars, no-unreachable, no-empty -- Preserve the legacy engine and intentionally disabled drawing paths during integration. */
// Legacy engine retained verbatim apart from its host, assets, and lifecycle adapters.
export default function startTypeEngine({ host, canvas, intro, assetMap, playIntro, onIntroComplete, placementSeed }) {
    const events = new AbortController();
    const timers = new Set();
    let animationFrame;
    function listen(target, type, callback) {
        target.addEventListener(type, callback, { signal: events.signal });
    }
    function scheduleTimeout(callback, delay) {
        const id = setTimeout(() => {
            timers.delete(id);
            callback();
        }, delay);
        timers.add(id);
        return id;
    }

    // -------------------- TYPE INTERACTION --------------------
    var ctx = canvas.getContext('2d');

    var COLOR_INK = '#0b0b0a';
    var COLOR_ACCENT = '#E2E2E2';
    var COLOR_ACCENT_STRONG = '#FD00A0';
    var cursorLayer = document.createElement('div');
    cursorLayer.className = 'type-cursor-layer';
    cursorLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorLayer);
    var clickCursor = document.createElement('div');
    clickCursor.className = 'type-click-cursor';
    clickCursor.textContent = 'CLICK!';
    clickCursor.setAttribute('aria-hidden', 'true');
    clickCursor.style.backgroundColor = COLOR_ACCENT_STRONG;
    clickCursor.hidden = true;
    cursorLayer.appendChild(clickCursor);
    var cursorTrails = ['#5F50D8','#009DEB',   '#00BFA3','#1D9F10', '#F7A600'].map(function (color) {
        var element = document.createElement('div');
        element.className = 'type-click-cursor';
        element.setAttribute('aria-hidden', 'true');
        element.style.backgroundColor = color;
        element.style.willChange = 'transform';
        element.hidden = true;
        return { element: element, x: 0, y: 0 };
    });
    // Equal-sized solid layers, ordered back-to-front beneath the original cursor.
    cursorTrails.slice().reverse().forEach(function (trail) {
        cursorLayer.insertBefore(trail.element, clickCursor);
    });
    var cursorTrailsVisible = false;
    var cursorOnCanvas = false;
    var cursorMedia = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

    function resetCursorLabel() {
        clickCursor.textContent = 'CLICK!';
    }

    function hideCursorTrails() {
        cursorTrailsVisible = false;
        cursorTrails.forEach(function (trail) { trail.element.hidden = true; });
    }

    function hideClickCursor() {
        cursorOnCanvas = false;
        clickCursor.hidden = true;
        hideCursorTrails();
        canvas.style.removeProperty('cursor');
    }
    var TEAM_COUNT = 8;
    // Graphic nodes orbit the eight typography groups; these values preserve their distribution.
    var NODE_COUNT = 113;
    var TEAM_SIZES = [15, 14, 14, 14, 14, 14, 14, 14];
    var NODE_RADIUS = 4;
    // Shared SVG extent. The animated renderRadius is retained only for existing physics.
    var TYPOGRAPHY_SIZE = 400;
    var TEAM_INFO = ['L', 'E', 'T', 'S1', 'S2', 'Y', 'N', 'C'].map(function (letter) { return { name: letter.replace(/[12]/, ''), category: 'LETS SYNC' }; });
    var LETTER_FILES = ['L_default.svg', 'E_default.svg', 'T_default.svg', 'S1_default.svg', 'S2_default.svg', 'Y_default.svg', 'N_default.svg', 'C_default.svg'];
    var letterImages = LETTER_FILES.map(function (file) { var img = new Image(); img.src = assetMap[file] || ''; return img; });
    var LETTER_VISUAL_ANGLES = [-11, 8, -6, 14, -18, 5, 12, -9];


    var SYNC_PAIR_FILES = {
        // L
        '0-1': ['LE_L.svg', 'LE_E.svg'],
        '0-2': ['LT_L.svg', 'LT_T.svg'],
        '0-3': ['LS1_L.svg', 'LS1_S1.svg'],
        '0-4': ['LS2_L.svg', 'LS2_S2.svg'],
        '0-5': ['LY_L.svg', 'LY_Y.svg'],
        '0-6': ['LN_L.svg', 'LN_N.svg'],
        '0-7': ['LC_L.svg', 'LC_C.svg'],

        // E
        '1-2': ['ET_E.svg', 'ET_T.svg'],
        '1-3': ['ES1_E.svg', 'ES1_S1.svg'],
        '1-4': ['ES2_E.svg', 'ES2_S2.svg'],
        '1-5': ['EY_E.svg', 'EY_Y.svg'],
        '1-6': ['EN_E.svg', 'EN_N.svg'],
        '1-7': ['EC_E.svg', 'EC_C.svg'],

        // T
        '2-3': ['TS1_T.svg', 'TS1_S1.svg'],
        '2-4': ['TS2_T.svg', 'TS2_S2.svg'],
        '2-5': ['TY_T.svg', 'TY_Y.svg'],
        '2-6': ['TN_T.svg', 'TN_N.svg'],
        '2-7': ['TC_T.svg', 'TC_C.svg'],

        // S1
        '3-4': ['S1S2_S1.svg', 'S1S2_S2.svg'],
        '3-5': ['S1Y_S1.svg', 'S1Y_Y.svg'],
        '3-6': ['S1N_S1.svg', 'S1N_N.svg'],
        // S1C_S1.svg is absent; use the existing, previously unreferenced S1 variant.
        '3-7': ['S1T_S1.svg', 'S1C_C.svg'],

        // S2
        '4-5': ['S2Y_S2.svg', 'S2Y_Y.svg'],
        '4-6': ['S2N_S2.svg', 'S2N_N.svg'],
        '4-7': ['S2C_S2.svg', 'S2C_C.svg'],

        // Y
        '5-6': ['YN_Y.svg', 'YN_N.svg'],
        '5-7': ['YC_Y.svg', 'YC_C.svg'],

        // N
        '6-7': ['NC_N.svg', 'NC_C.svg']
    };

    var syncPairImages = {};
    Object.keys(SYNC_PAIR_FILES).forEach(function (key) {
        syncPairImages[key] = SYNC_PAIR_FILES[key].map(function (file) {
            var img = new Image();
            img.src = assetMap[file.slice(file.lastIndexOf('_') + 1, -4) + '/' + file] || '';
            return img;
        });
    });
    function getSyncTypographyImage(teamId, t) {
        if (!syncEvent) return null;
        var age = t - syncEvent.born;
        if (age < 0 || age > syncEvent.duration) return null;
        var first = Math.min(syncEvent.teamA.id, syncEvent.teamB.id);
        var second = Math.max(syncEvent.teamA.id, syncEvent.teamB.id);
        if (teamId !== first && teamId !== second) return null;
        var images = syncPairImages[first + '-' + second];
        if (!images) return null;
        var img = images[teamId === first ? 0 : 1];
        return img && img.complete && img.naturalWidth > 0 ? img : null;
    }


    var reduceMotion = false;
    try {
        reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { }

    var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
    var W = 0, H = 0, WORLD_W = 0, WORLD_H = 0;

    var BLOB_ANCHORS = [
        [0.16, 0.22], [0.40, 0.19], [0.64, 0.21], [0.85, 0.32],
        [0.17, 0.72], [0.40, 0.79], [0.64, 0.73], [0.84, 0.78]
    ];

    function resize() {
        W = host.clientWidth;
        H = host.clientHeight;
        WORLD_W = W * 1.65;
        WORLD_H = H * 1.55;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    var nodes = [];
    var blobs = [];
    var camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
    var syncCameraSession = null;
    var cameraHandoff = null;
    var separationRecovery = new Map();
    var mouse = { x: W / 2, y: H / 2, worldX: 0, worldY: 0, active: false };
    var draggingNode = null;
    var draggingBlob = null;
    var draggingTeamNodes = null;
    var draggingTeamLastX = 0;
    var draggingTeamLastY = 0;
    var dragOffset = { x: 0, y: 0 };
    var hoveredNode = null;
    var hoveredTeam = null;
    var labelBounds = [];
    var connections = new Map();
    var syncLink = null;
    var lastSyncAt = -999;
    var syncSourceNode = null;
    var syncTargetNode = null;
    var syncTargetStrength = 0;
    var syncEvent = null;
    var syncSerial = 0;

    function fract(v) {
        return v - Math.floor(v);
    }

    function seeded(index, salt) {
        return fract(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123);
    }

    function hexToRgba(hex, alpha) {
        var clean = hex.replace('#', '');
        var r = parseInt(clean.slice(0, 2), 16);
        var g = parseInt(clean.slice(2, 4), 16);
        var b = parseInt(clean.slice(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    function getTypographyOrbitRadius(teamId) {
        var image = letterImages[teamId];
        var width = image.naturalWidth;
        var height = image.naturalHeight;
        // The half-diagonal encloses the complete SVG at every artwork rotation.
        var scale = width && height ? TYPOGRAPHY_SIZE / Math.max(width, height) : 1;
        var artworkRadius = width && height ? Math.hypot(width * scale, height * scale) / 2 : TYPOGRAPHY_SIZE / Math.SQRT2;
        // Include the rendered dot (minimum 6px), its scale, drift, and clear space.
        return artworkRadius + Math.max(6, NODE_RADIUS * 1.16) + 18 + 6 * Math.hypot(0.45, 0.40);
    }

    function createInitialTypographyPositions() {
        var visiblePositions = [[-0.16, 0.12], [0.83, -0.16], [0.25, 0.40], [1.15, 0.43], [-0.18, 0.91], [0.70, 0.91], [0.23, 1.21], [1.15, 1.14]];
        var margin = 24;
        var bases = visiblePositions.map(function (position) {
            return {
                x: Math.max(margin, Math.min(WORLD_W - margin, (WORLD_W - W) * .5 + W * (0.5 + (position[0] - 0.5) * 1.10))),
                y: Math.max(margin, Math.min(WORLD_H - margin, (WORLD_H - H) * .5 + H * (0.5 + (position[1] - 0.5) * 1.10)))
            };
        });
        for (var pass = 0; pass < 16; pass++) {
            var positions = [];
            var complete = true;
            bases.forEach(function (base, index) {
                var candidate = null;
                for (var attempt = 0; attempt < 24; attempt++) {
                    var salt = placementSeed * 997 + 101 + pass * 53 + attempt * 2;
                    var rangeX = Math.min(190, W * 0.14);
                    var rangeY = Math.min(150, H * 0.18);
                    var minX = Math.max(margin, base.x - rangeX);
                    var maxX = Math.min(WORLD_W - margin, base.x + rangeX);
                    var minY = Math.max(margin, base.y - rangeY);
                    var maxY = Math.min(WORLD_H - margin, base.y + rangeY);
                    var x = minX + seeded(index + 1, salt) * (maxX - minX);
                    var y = minY + seeded(index + 1, salt + 1) * (maxY - minY);
                    if (Math.hypot(x - base.x, y - base.y) < Math.min(70, W * 0.04, H * 0.06)) continue;
                    var clear = positions.every(function (other, otherIndex) {
                        var previousDistance = Math.hypot(base.x - bases[otherIndex].x, base.y - bases[otherIndex].y);
                        return Math.hypot(x - other.x, y - other.y) >= Math.min(TYPOGRAPHY_SIZE, previousDistance) * 0.9;
                    });
                    if (clear) {
                        candidate = { x: x, y: y };
                        break;
                    }
                }
                if (!candidate) complete = false;
                positions.push(candidate || base);
            });
            if (complete) return positions;
        }
        // Dense viewports still need a new entry layout if candidate placement fails.
        // A shared bounded adjustment preserves at least 92% of every base separation.
        var scaleX = 0.92 + seeded(9, placementSeed * 997 + 77) * 0.06;
        var scaleY = 0.92 + seeded(9, placementSeed * 997 + 78) * 0.06;
        var offsetX = seeded(9, placementSeed * 997 + 79) * (WORLD_W - margin * 2) * (1 - scaleX);
        var offsetY = seeded(9, placementSeed * 997 + 80) * (WORLD_H - margin * 2) * (1 - scaleY);
        return bases.map(function (base) {
            return { x: margin + (base.x - margin) * scaleX + offsetX,
                y: margin + (base.y - margin) * scaleY + offsetY };
        });
    }

    function layout() {
        if (nodes.length === 0) {
            // Only initial creation samples this entry's seed; resize and interaction never do.
            var initialPositions = createInitialTypographyPositions();
            blobs = [];
            for (var t = 0; t < TEAM_COUNT; t++) {
                var anchor = BLOB_ANCHORS[t];
                var cx = initialPositions[t].x;
                var cy = initialPositions[t].y;
                var coreRadius = 160 + (t % 4) * 7 + seeded(t + 1, 12) * 18;
                var orbitGap = 23 + seeded(t + 1, 16) * 5;
                var ellipseScale = 0.97 + seeded(t + 1, 17) * 0.05;
                var orbitRadii = [
                    { x: coreRadius + orbitGap, y: (coreRadius + orbitGap) * ellipseScale },
                    { x: coreRadius + orbitGap * 2, y: (coreRadius + orbitGap * 2) * ellipseScale },
                    { x: coreRadius + orbitGap * 3, y: (coreRadius + orbitGap * 3) * ellipseScale }
                ];
                blobs.push({
                    id: t,
                    team: t,
                    anchorX: cx / WORLD_W,
                    anchorY: cy / WORLD_H,
                    baseX: cx,
                    baseY: cy,
                    currentX: cx,
                    currentY: cy,
                    coreRadius: coreRadius,
                    renderRadius: coreRadius,
                    orbitRadii: orbitRadii,
                    outerRadius: Math.max(orbitRadii[2].x, orbitRadii[2].y) + NODE_RADIUS,
                    info: TEAM_INFO[t],
                    hoverAmount: 0,
                    phase: seeded(t + 1, 13) * Math.PI * 2,
                    speed: 0.055 + seeded(t + 1, 14) * 0.055,
                    z: 0.65 + seeded(t + 1, 15) * 0.35,
                    travelSpeed: 6 + seeded(t + 1, 40) * 10,
                    velocityX: Math.cos(seeded(t + 1, 41) * Math.PI * 2) * (6 + seeded(t + 1, 40) * 10),
                    velocityY: Math.sin(seeded(t + 1, 41) * Math.PI * 2) * (6 + seeded(t + 1, 40) * 10),
                    targetX: cx,
                    targetY: cy,
                    waypointIndex: 0,
                    waypointAge: 999,
                    waypointDuration: 55 + seeded(t + 1, 42) * 35,
                    dragTargetX: null,
                    dragTargetY: null,
                    syncEnergy: 0,
                    syncSeed: seeded(t + 1, 71),
                    syncStyle: t % 6,
                    syncSourceAngle: 0,
                    syncCooldown: 0,
                    syncPalette: 0,
                    syncVariant: 0,
                    syncSpin: 1,
                    syncStart: -999,
                    syncRotation: 0
                });
            }

            var teamIndex = 0;
            var teamCursor = 0;
            nodes = [];

            for (var i = 0; i < NODE_COUNT; i++) {
                while (i >= teamCursor + TEAM_SIZES[teamIndex]) {
                    teamCursor += TEAM_SIZES[teamIndex];
                    teamIndex++;
                }

                var team = blobs[teamIndex];
                var minRadius = getTypographyOrbitRadius(teamIndex);
                var maxRadius = minRadius + (team.outerRadius + 8 - (team.coreRadius + 18));
                var localX = 0;
                var localY = 0;
                var placed = false;

                for (var attempt = 0; attempt < 24 && !placed; attempt++) {
                    var angle = seeded(i + 1, 31 + attempt * 2) * Math.PI * 2;
                    var distance = minRadius + seeded(i + 1, 32 + attempt * 2) * (maxRadius - minRadius);
                    localX = Math.cos(angle) * distance;
                    localY = Math.sin(angle) * distance;
                    placed = nodes.every(function (other) {
                        if (other.team !== teamIndex) return true;
                        return Math.hypot(localX - other.homeLocalX, localY - other.homeLocalY) > NODE_RADIUS * 3.4;
                    });
                }

                nodes.push({
                    idx: i,
                    id: i + 1,
                    team: teamIndex,
                    r: NODE_RADIUS,
                    z: 0.55 + seeded(i + 1, 7) * 0.45,
                    minRadius: minRadius,
                    maxRadius: maxRadius,
                    homeLocalX: localX,
                    homeLocalY: localY,
                    homeRadius: distance,
                    orbitAngle: angle,
                    orbitSpeed: 0.09 + seeded(i + 1, 20) * 0.09,
                    orbitDirection: seeded(i + 1, 21) < 0.70 ? 1 : -1,
                    driftPhase: seeded(i + 1, 10) * Math.PI * 2,
                    driftSpeed: 0.10 + seeded(i + 1, 11) * 0.09,
                    driftAmount: 2.5 + seeded(i + 1, 18) * 3.5,
                    angularDrift: 0.016 + seeded(i + 1, 19) * 0.024,
                    x: team.currentX + localX,
                    y: team.currentY + localY,
                    scale: 1,
                    pulses: [],
                    freeDragX: null,
                    freeDragY: null,
                    returning: false,
                    returnX: 0,
                    returnY: 0,
                    returnVX: 0,
                    returnVY: 0,
                    syncRole: null,
                    syncVisual: 0
                });
            }
        } else {
            blobs.forEach(function (blob) {
                blob.baseX = WORLD_W * blob.anchorX;
                blob.baseY = WORLD_H * blob.anchorY;
                blob.currentX = blob.baseX;
                blob.currentY = blob.baseY;
                blob.waypointAge = 999;
            });
        }
        camera.x = Math.max(0, Math.min(WORLD_W - W, (WORLD_W - W) * 0.5));
        camera.y = Math.max(0, Math.min(WORLD_H - H, (WORLD_H - H) * 0.5));
        camera.targetX = camera.x;
        camera.targetY = camera.y;
    }

    function getTeamMembers(team) {
        return nodes.filter(function (n) { return n.team === team; });
    }

    function screenToWorld(p) {
        return { x: p.x + camera.x, y: p.y + camera.y };
    }

    function pointerPos(evt) {
        var rect = canvas.getBoundingClientRect();
        var cx = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
        var cy = (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top;
        return { x: cx, y: cy };
    }

    listen(canvas, 'pointerdown', function (e) {
        resetCursorLabel();
        cursorOnCanvas = e.pointerType === 'mouse';
        var p = pointerPos(e);
        var w = screenToWorld(p);
        mouse.x = p.x; mouse.y = p.y; mouse.worldX = w.x; mouse.worldY = w.y; mouse.active = true;

        var hit = null, best = 1e9;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var d = Math.hypot(w.x - n.x, w.y - n.y);
            if (d < n.r + 14 && d < best) {
                best = d;
                hit = n;
            }
        }

        if (hit) {
            draggingNode = hit;
            clickCursor.textContent = 'DRAG!';
            canvas.setPointerCapture(e.pointerId);
            return;
        }

        var blobHit = null;
        best = 1e9;
        for (var b = 0; b < blobs.length; b++) {
            var blob = blobs[b];
            var bd = Math.hypot(w.x - blob.currentX, w.y - blob.currentY);
            if (bd < blob.renderRadius && bd < best) {
                best = bd;
                blobHit = blob;
            }
        }

        if (blobHit) {
            draggingBlob = blobHit;
            dragOffset.x = blobHit.currentX - w.x;
            dragOffset.y = blobHit.currentY - w.y;
            canvas.setPointerCapture(e.pointerId);

        }
    });

    listen(canvas, 'pointermove', function (e) {
        cursorOnCanvas = e.pointerType === 'mouse';
        var p = pointerPos(e);
        var w = screenToWorld(p);
        mouse.x = p.x; mouse.y = p.y; mouse.worldX = w.x; mouse.worldY = w.y; mouse.active = true;

        if (draggingNode) {
            // A follows the pointer exactly.
            draggingNode.x = w.x;
            draggingNode.y = w.y;
            draggingNode.freeDragX = w.x;
            draggingNode.freeDragY = w.y;

            // Every teammate follows A while preserving the team's relative layout.
            // A small interpolation makes them feel pulled by A rather than welded to it.
            if (draggingTeamNodes) {
                for (var dmi = 0; dmi < draggingTeamNodes.length; dmi++) {
                    var mn = draggingTeamNodes[dmi];
                    if (mn === draggingNode) continue;

                    var targetX = w.x + (mn.teamDragOffsetX || 0);
                    var targetY = w.y + (mn.teamDragOffsetY || 0);

                    mn.x += (targetX - mn.x) * 0.34;
                    mn.y += (targetY - mn.y) * 0.34;
                    mn.freeDragX = mn.x;
                    mn.freeDragY = mn.y;
                }
            }

            draggingTeamLastX = w.x;
            draggingTeamLastY = w.y;
        } else if (draggingBlob) {
            draggingBlob.dragTargetX = w.x + dragOffset.x;
            draggingBlob.dragTargetY = w.y + dragOffset.y;
        }
    });

    function endDrag(e) {
        resetCursorLabel();
        if (draggingNode) {
            var n = draggingNode;
            n.pulses.push({ t: 0 });
            var heldBySync = syncEvent && (syncEvent.a === n || syncEvent.b === n) &&
                ((performance.now() - start) / 1000 - syncEvent.born) < syncEvent.duration;
            n.returning = !heldBySync;
            n.returnX = n.x;
            n.returnY = n.y;
            n.returnVX = 0;
            n.returnVY = 0;
            n.freeDragX = null;
            n.freeDragY = null;
            // All non-synced teammates spring back to their own original team orbits.
            if (draggingTeamNodes) {
                for (var dri = 0; dri < draggingTeamNodes.length; dri++) {
                    var rn = draggingTeamNodes[dri];
                    var heldByPair = syncEvent && (syncEvent.a === rn || syncEvent.b === rn) &&
                        ((performance.now() - start) / 1000 - syncEvent.born) < syncEvent.duration;
                    if (!heldByPair) {
                        rn.returning = true;
                        rn.returnX = rn.x;
                        rn.returnY = rn.y;
                        rn.returnVX = 0;
                        rn.returnVY = 0;
                    }
                    rn.freeDragX = null;
                    rn.freeDragY = null;
                    rn.teamDragOffsetX = null;
                    rn.teamDragOffsetY = null;
                }
            }
            try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
            draggingNode = null;
            draggingTeamNodes = null;
        }

        if (draggingBlob) {
            draggingBlob.baseX = draggingBlob.currentX;
            draggingBlob.baseY = draggingBlob.currentY;
            draggingBlob.dragTargetX = null;
            draggingBlob.dragTargetY = null;
            draggingBlob.velocityX *= 0.25;
            draggingBlob.velocityY *= 0.25;
            draggingBlob.waypointAge = 999;
            try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
            draggingBlob = null;
        }
    }

    listen(canvas, 'pointerup', endDrag);
    listen(canvas, 'pointercancel', endDrag);
    listen(canvas, 'pointercancel', hideClickCursor);
    listen(window, 'pointerup', resetCursorLabel);
    listen(window, 'pointercancel', resetCursorLabel);
    listen(window, 'blur', resetCursorLabel);
    listen(canvas, 'lostpointercapture', resetCursorLabel);
    function stopPointerExploration() {
        hideClickCursor();
        mouse.active = false;
        if (!syncEvent && !syncCameraSession) {
            camera.targetX = camera.x;
            camera.targetY = camera.y;
        }
        hoveredNode = null;
        hoveredTeam = null;
    }

    listen(canvas, 'pointerleave', function (e) {
        hideClickCursor();
        hoveredNode = null;
        hoveredTeam = null;
        // The header overlays the hero; it is still part of mouse exploration.
        if (e.pointerType === 'mouse' && e.relatedTarget?.closest?.('.site-header')) return;
        stopPointerExploration();
    });
    listen(window, 'pointermove', function (e) {
        if (e.pointerType !== 'mouse' || !e.target?.closest?.('.site-header')) return;
        var rect = canvas.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            stopPointerExploration();
            return;
        }
        var p = pointerPos(e);
        var w = screenToWorld(p);
        mouse.x = p.x; mouse.y = p.y; mouse.worldX = w.x; mouse.worldY = w.y; mouse.active = true;
    });
    listen(window, 'pointerout', function (e) {
        if (!e.relatedTarget) stopPointerExploration();
    });
    listen(window, 'blur', stopPointerExploration);

    var start = performance.now();
    var last = start;

    function getSyncArtworkBounds(t) {
        var box = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
        [syncEvent.teamA, syncEvent.teamB].forEach(function (team) {
            var images = [letterImages[team.id], getSyncTypographyImage(team.id, t)];
            var angle = LETTER_VISUAL_ANGLES[team.id] * Math.PI / 180;
            // Include both sides of the existing SVG crossfade at their rendered size.
            var side = TYPOGRAPHY_SIZE;
            images.forEach(function (image) {
                if (!image || !image.naturalWidth || !image.naturalHeight) return;
                var scale = Math.min(side / image.naturalWidth, side / image.naturalHeight);
                var halfW = (Math.abs(Math.cos(angle)) * image.naturalWidth + Math.abs(Math.sin(angle)) * image.naturalHeight) * scale * 0.5;
                var halfH = (Math.abs(Math.sin(angle)) * image.naturalWidth + Math.abs(Math.cos(angle)) * image.naturalHeight) * scale * 0.5;
                box.left = Math.min(box.left, team.currentX - halfW);
                box.right = Math.max(box.right, team.currentX + halfW);
                box.top = Math.min(box.top, team.currentY - halfH);
                box.bottom = Math.max(box.bottom, team.currentY + halfH);
            });
        });
        return box;
    }

    function syncCameraTarget(box, maxX, maxY) {
        function fitAxis(current, near, far, size, maximum) {
            var low = far + 24 - size;
            var high = near - 24;
            // When both artworks cannot fit at the unchanged zoom/range, show
            // the largest possible portion without moving either typography.
            var target = low <= high ? Math.max(low, Math.min(high, current)) : (near + far - size) * 0.5;
            return Math.max(0, Math.min(maximum, target));
        }
        return { x: fitAxis(camera.x, box.left, box.right, W, maxX), y: fitAxis(camera.y, box.top, box.bottom, H, maxY) };
    }

    function updateCamera() {
        var maxX = Math.max(0, WORLD_W - W);
        var maxY = Math.max(0, WORLD_H - H);
        var t = (performance.now() - start) / 1000;
        var active = syncEvent && t >= syncEvent.born && t <= syncEvent.born + syncEvent.duration;
        var now = performance.now();
        function ease(value) { return value * value * (3 - 2 * value); }

        if (active) {
            var box = getSyncArtworkBounds(t);
            var target = isFinite(box.left) ? syncCameraTarget(box, maxX, maxY) : { x: camera.x, y: camera.y };
            var needsMove = Math.abs(target.x - camera.x) > 0.1 || Math.abs(target.y - camera.y) > 0.1;
            if (!syncCameraSession && needsMove) {
                syncCameraSession = {
                    serial: syncSerial, phase: 'focus', began: now, fromX: camera.x, fromY: camera.y
                };
            }
            if (syncCameraSession) {
                var session = syncCameraSession;
                if (session.serial !== syncSerial || session.phase !== 'focus') {
                    session.serial = syncSerial;
                    session.phase = 'focus';
                    session.began = now;
                    session.fromX = camera.x;
                    session.fromY = camera.y;
                }
                camera.targetX = target.x;
                camera.targetY = target.y;
                var previousX = camera.x;
                var previousY = camera.y;
                var progress = Math.min(1, (now - session.began) / 900);
                if (progress < 1) {
                    camera.x = session.fromX + (target.x - session.fromX) * ease(progress);
                    camera.y = session.fromY + (target.y - session.fromY) * ease(progress);
                } else {
                    camera.x += (target.x - camera.x) * 0.032;
                    camera.y += (target.y - camera.y) * 0.032;
                }
                session.velocityX = camera.x - previousX;
                session.velocityY = camera.y - previousY;
                return;
            }
        }

        if (syncCameraSession) {
            cameraHandoff = { pointerX: mouse.x, pointerY: mouse.y, moved: false,
                velocityX: syncCameraSession.velocityX || 0, velocityY: syncCameraSession.velocityY || 0 };
            camera.targetX = camera.x;
            camera.targetY = camera.y;
            syncCameraSession = null;
        }

        // Preserve the original mouse exploration range and sensitivity.
        if (mouse.active && !reduceMotion) {
            var pointerTargetX = Math.max(0, Math.min(maxX, (mouse.x / Math.max(1, W)) * maxX));
            var pointerTargetY = Math.max(0, Math.min(maxY, (mouse.y / Math.max(1, H)) * maxY));
            if (cameraHandoff) {
                cameraHandoff.moved = cameraHandoff.moved || Math.hypot(mouse.x - cameraHandoff.pointerX, mouse.y - cameraHandoff.pointerY) > 1;
                if (cameraHandoff.moved) {
                    camera.targetX += (pointerTargetX - camera.targetX) * 0.032;
                    camera.targetY += (pointerTargetY - camera.targetY) * 0.032;
                }
                camera.x = Math.max(0, Math.min(maxX, camera.x + cameraHandoff.velocityX));
                camera.y = Math.max(0, Math.min(maxY, camera.y + cameraHandoff.velocityY));
                cameraHandoff.velocityX *= 0.968;
                cameraHandoff.velocityY *= 0.968;
                if (!cameraHandoff.moved) {
                    camera.targetX = camera.x;
                    camera.targetY = camera.y;
                } else if (Math.hypot(pointerTargetX - camera.targetX, pointerTargetY - camera.targetY) < 0.1) {
                    cameraHandoff = null;
                }
            } else {
                camera.targetX = pointerTargetX;
                camera.targetY = pointerTargetY;
            }
        } else if (cameraHandoff) {
            cameraHandoff.velocityX = cameraHandoff.velocityY = 0;
        }
        camera.x += (camera.targetX - camera.x) * 0.0065;
        camera.y += (camera.targetY - camera.y) * 0.0065;
    }

    function syncDraggedObject() {
        if (draggingNode) {
            draggingNode.x = mouse.worldX;
            draggingNode.y = mouse.worldY;
            draggingNode.freeDragX = mouse.worldX;
            draggingNode.freeDragY = mouse.worldY;

            if (draggingTeamNodes) {
                for (var dm2 = 0; dm2 < draggingTeamNodes.length; dm2++) {
                    var mn2 = draggingTeamNodes[dm2];
                    if (mn2 === draggingNode) continue;

                    var targetX2 = mouse.worldX + (mn2.teamDragOffsetX || 0);
                    var targetY2 = mouse.worldY + (mn2.teamDragOffsetY || 0);

                    mn2.x += (targetX2 - mn2.x) * 0.34;
                    mn2.y += (targetY2 - mn2.y) * 0.34;
                    mn2.freeDragX = mn2.x;
                    mn2.freeDragY = mn2.y;
                }
            }

            draggingTeamLastX = mouse.worldX;
            draggingTeamLastY = mouse.worldY;
        } else if (draggingBlob) {
            draggingBlob.dragTargetX = mouse.worldX + dragOffset.x;
            draggingBlob.dragTargetY = mouse.worldY + dragOffset.y;
        }
    }

    function setNodeLocalPosition(node, worldX, worldY) {
        var team = blobs[node.team];
        var localX = worldX - team.currentX;
        var localY = worldY - team.currentY;
        var distance = Math.hypot(localX, localY);
        var angle = distance > 0.001 ? Math.atan2(localY, localX) : 0;
        var clampedDistance = Math.max(node.minRadius, Math.min(node.maxRadius, distance));
        node.homeRadius = clampedDistance;
        node.orbitAngle = angle;
        node.homeLocalX = Math.cos(angle) * clampedDistance;
        node.homeLocalY = Math.sin(angle) * clampedDistance;
        node.x = team.currentX + node.homeLocalX;
        node.y = team.currentY + node.homeLocalY;
    }

    // Movement belongs to the world, not the camera's current viewport.
    function getTeamTravelBounds(b) {
        var marginX = Math.min(b.outerRadius + 18, WORLD_W / 4);
        var marginY = Math.min(b.outerRadius + 18, WORLD_H / 4);
        var spacing = 0;
        blobs.forEach(function (team) {
            spacing = Math.max(spacing, getTypographyOrbitRadius(team.id) * 2 +
                team.outerRadius + 8 - (team.coreRadius + 18) + 6 * Math.hypot(0.45, 0.40));
        });
        var columns = Math.max(1, Math.min(TEAM_COUNT, Math.ceil(Math.sqrt(TEAM_COUNT * WORLD_W / WORLD_H))));
        var rows = Math.ceil(TEAM_COUNT / columns);
        // Leave room for the permitted spacing; clamping to a smaller area jams the teams.
        // This expands only team travel, never the camera's exploration range or zoom.
        var width = Math.max(WORLD_W - marginX * 2, spacing * (columns - 0.5));
        var height = Math.max(WORLD_H - marginY * 2, spacing * (rows - 0.5));
        return { minX: (WORLD_W - width) / 2, maxX: (WORLD_W + width) / 2,
            minY: (WORLD_H - height) / 2, maxY: (WORLD_H + height) / 2 };
    }

    function chooseNextTeamTarget(b) {
        b.waypointIndex++;
        var bounds = getTeamTravelBounds(b);
        var availableW = Math.max(1, bounds.maxX - bounds.minX - 48);
        var availableH = Math.max(1, bounds.maxY - bounds.minY - 48);
        var seedIndex = (b.id + 1) * 37 + b.waypointIndex * 11;
        b.targetX = bounds.minX + 24 + seeded(seedIndex, 51) * availableW;
        b.targetY = bounds.minY + 24 + seeded(seedIndex, 52) * availableH;
        b.waypointAge = 0;
        b.waypointDuration = 55 + seeded(seedIndex, 53) * 35;
    }

    function updateTeamPosition(b, t, dt) {
        var wob = reduceMotion ? 0.12 : 1;

        var breathe =
            Math.sin(t * (0.34 + b.speed * 0.75) + b.phase) * 0.105 +
            Math.sin(t * (0.15 + b.speed * 0.32) + b.phase * 1.7) * 0.035;
        var r = b.coreRadius * (1 + breathe * wob);

        if (draggingBlob === b && b.dragTargetX !== null) {
            b.currentX = b.dragTargetX;
            b.currentY = b.dragTargetY;
            b.velocityX *= 0.92;
            b.velocityY *= 0.92;
        } else if (b.dragTargetX !== null) {
            b.currentX += (b.dragTargetX - b.currentX) * 0.10;
            b.currentY += (b.dragTargetY - b.currentY) * 0.10;
        } else {
            b.waypointAge += dt;
            var targetDX = b.targetX - b.currentX;
            var targetDY = b.targetY - b.currentY;
            var targetDistance = Math.hypot(targetDX, targetDY);
            if (b.waypointAge >= b.waypointDuration || targetDistance < b.outerRadius * 0.72) {
                chooseNextTeamTarget(b);
                targetDX = b.targetX - b.currentX;
                targetDY = b.targetY - b.currentY;
                targetDistance = Math.hypot(targetDX, targetDY);
            }

            var desiredX = targetDistance > 0.001 ? targetDX / targetDistance * b.travelSpeed : 0;
            var desiredY = targetDistance > 0.001 ? targetDY / targetDistance * b.travelSpeed : 0;
            var bounds = getTeamTravelBounds(b);
            var steerZone = b.outerRadius * 0.7 + 90;
            // Opposite steering zones must not overlap on narrow viewports.
            var steerX = Math.min(steerZone, (bounds.maxX - bounds.minX) / 2);
            var steerY = Math.min(steerZone, (bounds.maxY - bounds.minY) / 2);

            if (b.currentX < bounds.minX + steerX) {
                desiredX += (1 - Math.max(0, b.currentX - bounds.minX) / steerX) * b.travelSpeed;
            } else if (b.currentX > bounds.maxX - steerX) {
                desiredX -= (1 - Math.max(0, bounds.maxX - b.currentX) / steerX) * b.travelSpeed;
            }
            if (b.currentY < bounds.minY + steerY) {
                desiredY += (1 - Math.max(0, b.currentY - bounds.minY) / steerY) * b.travelSpeed;
            } else if (b.currentY > bounds.maxY - steerY) {
                desiredY -= (1 - Math.max(0, bounds.maxY - b.currentY) / steerY) * b.travelSpeed;
            }

            var desiredLength = Math.hypot(desiredX, desiredY);
            if (desiredLength > b.travelSpeed) {
                desiredX = desiredX / desiredLength * b.travelSpeed;
                desiredY = desiredY / desiredLength * b.travelSpeed;
            }

            var steering = Math.min(1, dt * 0.24);
            b.velocityX += (desiredX - b.velocityX) * steering;
            b.velocityY += (desiredY - b.velocityY) * steering;
            var globalMotion = reduceMotion ? 0.18 : 1;
            b.currentX += b.velocityX * dt * globalMotion;
            b.currentY += b.velocityY * dt * globalMotion;

            if (!b.syncResuming) {
                b.currentX = Math.max(bounds.minX, Math.min(bounds.maxX, b.currentX));
                b.currentY = Math.max(bounds.minY, Math.min(bounds.maxY, b.currentY));
            } else if (b.currentX >= bounds.minX && b.currentX <= bounds.maxX &&
                b.currentY >= bounds.minY && b.currentY <= bounds.maxY) {
                b.syncResuming = false;
            }
        }

        b.renderRadius = Math.max(b.coreRadius * 0.85, Math.min(b.coreRadius * 1.15, r));
    }

    // During SYNC, the two participating team systems gently pull closer together.
    // This only affects the SYNC motion; all other movement/design stays unchanged.
    function attractSyncTeams(t, dt) {
        if (!syncEvent) return;

        var age = t - syncEvent.born;
        if (age < 0 || age > syncEvent.duration) return;

        var a = syncEvent.teamA;
        var b = syncEvent.teamB;
        if (!a || !b || a === b) return;

        var dx = b.currentX - a.currentX;
        var dy = b.currentY - a.currentY;
        var distance = Math.hypot(dx, dy);
        if (distance < 0.001) return;

        // Start pulling shortly after the graphic nodes connect,
        // then smoothly release near the end of the SYNC.
        var pullIn = Math.min(1, Math.max(0, (age - 0.10) / 0.65));
        var pullOut = Math.min(1, Math.max(0, (syncEvent.duration - age) / 0.70));
        var strength = pullIn * pullOut;
        if (strength <= 0) return;

        var nx = dx / distance;
        var ny = dy / distance;

        // Let the two large circles/orbit systems come visibly closer,
        // but do not collapse into one another.
        var desiredDistance = (a.renderRadius + b.renderRadius) * 1.02;
        var excess = distance - desiredDistance;
        if (excess <= 0) return;

        var move = Math.min(excess * 0.075, 4.8) * strength * Math.min(1, dt * 60);

        // Once the two team systems come close, orbit them around their SHARED midpoint.
        // The whole team system moves as one body; it does not independently spin in place.
        var orbitFadeIn = Math.min(1, Math.max(0, (age - 0.38) / 0.42));
        var orbitFadeOut = Math.min(1, Math.max(0, (syncEvent.duration - age) / 0.28));
        var orbitStrength = Math.max(0, Math.min(orbitFadeIn, orbitFadeOut));

        if (orbitStrength > 0.001) {
            if (!syncEvent.teamOrbitReady) {
                syncEvent.teamOrbitReady = true;
                syncEvent.teamOrbitAngle = Math.atan2(
                    b.currentY - a.currentY,
                    b.currentX - a.currentX
                );
            }

            var midX = (a.currentX + b.currentX) * 0.5;
            var midY = (a.currentY + b.currentY) * 0.5;
            var pairDistance = Math.hypot(
                b.currentX - a.currentX,
                b.currentY - a.currentY
            );

            // Keep the two complete systems close while they circle each other.
            var orbitRadius = Math.max(
                (a.renderRadius + b.renderRadius) * 0.54,
                pairDistance * 0.5
            );

            syncEvent.teamOrbitAngle += dt * 2.15 * (syncEvent.spin || 1) * orbitStrength;

            var oa = syncEvent.teamOrbitAngle;
            var targetAX = midX - Math.cos(oa) * orbitRadius;
            var targetAY = midY - Math.sin(oa) * orbitRadius;
            var targetBX = midX + Math.cos(oa) * orbitRadius;
            var targetBY = midY + Math.sin(oa) * orbitRadius;

            var orbitFollow = Math.min(1, dt * 7.5) * orbitStrength;
            a.currentX += (targetAX - a.currentX) * orbitFollow;
            a.currentY += (targetAY - a.currentY) * orbitFollow;
            b.currentX += (targetBX - b.currentX) * orbitFollow;
            b.currentY += (targetBY - b.currentY) * orbitFollow;
        }

        // Keep the orbit/node layout itself stable: the visible rotation now comes
        // from the TWO complete team systems revolving around each other.
        a.syncRotation = 0;
        b.syncRotation = 0;

        var aPinned = draggingBlob === a || a.dragTargetX !== null;
        var bPinned = draggingBlob === b || b.dragTargetX !== null;

        if (aPinned && !bPinned) {
            b.currentX -= nx * move * 2;
            b.currentY -= ny * move * 2;
        } else if (bPinned && !aPinned) {
            a.currentX += nx * move * 2;
            a.currentY += ny * move * 2;
        } else {
            a.currentX += nx * move;
            a.currentY += ny * move;
            b.currentX -= nx * move;
            b.currentY -= ny * move;
        }
    }

    function relaxSyncRotations(dt) {
        for (var i = 0; i < blobs.length; i++) {
            var b = blobs[i];
            var active = syncEvent && (syncEvent.teamA === b || syncEvent.teamB === b) &&
                ((performance.now() - start) / 1000 - syncEvent.born) <= syncEvent.duration;
            if (!active) {
                b.syncRotation = (b.syncRotation || 0) * Math.pow(0.08, dt);
                if (Math.abs(b.syncRotation) < 0.0001) b.syncRotation = 0;
            }
        }
    }

    function separateBlobs(dt) {
        var clearances = blobs.map(function (team) {
            var inner = getTypographyOrbitRadius(team.id);
            var bandWidth = team.outerRadius + 8 - (team.coreRadius + 18);
            return { inner: inner, outer: inner + bandWidth + 6 * Math.hypot(0.45, 0.40) };
        });
        if (!syncEvent) {
            separationRecovery.forEach(function (recovery) {
                recovery.age += dt;
                recovery.distance += recovery.speed * (1 - Math.exp(-0.24 * recovery.age)) * dt;
            });
        }
        // Preserve the original separation during the intentional SYNC approach.
        for (var pass = 0; pass < (syncEvent ? 2 : 32); pass++) {
            var largestOverlap = 0;
            for (var i = 0; i < blobs.length; i++) {
                for (var j = i + 1; j < blobs.length; j++) {
                    var a = blobs[i];
                    var b = blobs[j];
                    var dx = b.currentX - a.currentX;
                    var dy = b.currentY - a.currentY;
                    var distance = Math.hypot(dx, dy);
                    var orbitDistance = (a.outerRadius + b.outerRadius) * 0.72;
                    var coreDistance = (a.renderRadius + b.renderRadius) * 1.35;
                    var minDistance = Math.max(orbitDistance, coreDistance);
                    if (!syncEvent) {
                        // Either team's outermost dot must clear the other complete SVG.
                        minDistance = Math.max(minDistance,
                            clearances[i].outer + clearances[j].inner,
                            clearances[j].outer + clearances[i].inner);
                        var key = i + '-' + j;
                        var recovery = separationRecovery.get(key);
                        if (recovery) {
                            if (recovery.distance >= minDistance) separationRecovery.delete(key);
                            else minDistance = recovery.distance;
                        }
                    }
                    if (distance >= minDistance) continue;

                    if (distance < 0.001) {
                        dx = Math.cos((i + 1) * 1.7);
                        dy = Math.sin((j + 1) * 1.7);
                        distance = 1;
                    }

                    var nx = dx / distance;
                    var ny = dy / distance;
                    var overlap = minDistance - distance;
                    largestOverlap = Math.max(largestOverlap, overlap);
                    var aPinned = draggingBlob === a || a.dragTargetX !== null;
                    var bPinned = draggingBlob === b || b.dragTargetX !== null;

                    if (aPinned && !bPinned) {
                        b.currentX += nx * overlap;
                        b.currentY += ny * overlap;
                    } else if (bPinned && !aPinned) {
                        a.currentX -= nx * overlap;
                        a.currentY -= ny * overlap;
                    } else {
                        a.currentX -= nx * overlap * 0.5;
                        a.currentY -= ny * overlap * 0.5;
                        b.currentX += nx * overlap * 0.5;
                        b.currentY += ny * overlap * 0.5;
                    }
                }
            }
            if (!syncEvent && largestOverlap < 0.01) break;
        }
    }


    function triggerTeamSync(teamA, teamB, nodeA, nodeB, t) {
        if (!teamA || !teamB || teamA === teamB) return;
        if (t - lastSyncAt < 0.55) return;
        lastSyncAt = t;
        syncSerial++;

        function assignRandomPhenomenon(team, salt) {
            // Recomputed every single SYNC: the same team never owns one fixed motion.
            var raw = Math.random();
            team.syncStyle = Math.floor(raw * 12) % 12;
            team.syncPalette = Math.floor(Math.random() * 8);
            team.syncVariant = Math.random();
            team.syncSpin = Math.random() < .5 ? -1 : 1;
            team.syncStart = t;
            team.syncEnergy = 1;
        }

        // Pattern motion must NOT appear before the nodes have visibly connected.
        // Store the randomized responses now, but activate them later in updateAndDrawSyncPair.
        function prepareRandomPhenomenon(team) {
            team.syncStyle = Math.floor(Math.random() * 12) % 12;
            team.syncPalette = Math.floor(Math.random() * 8);
            team.syncVariant = Math.random();
            team.syncSpin = Math.random() < .5 ? -1 : 1;
            team.syncEnergy = 0;
            team.syncStart = -999;
        }
        prepareRandomPhenomenon(teamA);
        prepareRandomPhenomenon(teamB);
        if (teamB.syncStyle === teamA.syncStyle && Math.random() < .8) {
            teamB.syncStyle = (teamB.syncStyle + 1 + Math.floor(Math.random() * 10)) % 12;
        }

        teamA.syncSourceAngle = Math.atan2(nodeA.y - teamA.currentY, nodeA.x - teamA.currentX);
        teamB.syncSourceAngle = Math.atan2(nodeB.y - teamB.currentY, nodeB.x - teamB.currentX);

        nodeA.pulses.push({ t: 0 });
        nodeB.pulses.push({ t: 0 });
        nodeA.syncRole = 'source';
        nodeB.syncRole = 'target';
        nodeA.syncVisual = 1;
        nodeB.syncVisual = 1;

        syncLink = { a: nodeA, b: nodeB, born: t, duration: 5.15 };
        syncEvent = {
            a: nodeA, b: nodeB,
            teamA: teamA, teamB: teamB,
            born: t, duration: 5.15,
            spin: Math.random() < .5 ? -1 : 1,
            phase: Math.random() * Math.PI * 2
        };
    }

    function updateSyncInteraction(t, dt) {
        for (var bi = 0; bi < blobs.length; bi++) {
            // Team-core visuals are activated explicitly AFTER the A/B node connection phase.
            if (!(syncEvent && syncEvent.patternStarted &&
                (syncEvent.teamA === blobs[bi] || syncEvent.teamB === blobs[bi]))) {
                blobs[bi].syncEnergy = Math.max(0, blobs[bi].syncEnergy - dt * 1.8);
            }
            blobs[bi].syncCooldown = Math.max(0, blobs[bi].syncCooldown - dt);
        }

        syncSourceNode = draggingNode || null;
        syncTargetNode = null;
        syncTargetStrength += (0 - syncTargetStrength) * Math.min(1, dt * 8);

        if (!draggingNode) return;

        var a = draggingNode;
        var nearest = null;
        var nearestDistance = 1e9;
        for (var i = 0; i < nodes.length; i++) {
            var b = nodes[i];
            if (b === a || b.team === a.team) continue;
            var d = Math.hypot(b.x - a.x, b.y - a.y);
            if (d < nearestDistance) {
                nearestDistance = d;
                nearest = b;
            }
        }

        var syncDistance = 70;
        if (nearest && nearestDistance < syncDistance) {
            syncTargetNode = nearest;
            var desiredTargetStrength = 1 - nearestDistance / syncDistance;
            syncTargetStrength += (desiredTargetStrength - syncTargetStrength) * Math.min(1, dt * 12);
            var teamA = blobs[a.team];
            var teamB = blobs[nearest.team];
            var proximity = 1 - nearestDistance / syncDistance;
            teamA.syncEnergy = Math.max(teamA.syncEnergy, proximity * 0.34);
            teamB.syncEnergy = Math.max(teamB.syncEnergy, proximity * 0.34);

            if (nearestDistance < Math.max(18, (a.r + nearest.r) * 1.15) &&
                teamA.syncCooldown <= 0 && teamB.syncCooldown <= 0) {
                triggerTeamSync(teamA, teamB, a, nearest, t);
                teamA.syncCooldown = 1.7;
                teamB.syncCooldown = 1.7;
            }
        }
    }

    function drawSyncLink(t) {
        if (!syncLink) return;
        var age = t - syncLink.born;
        if (age > syncLink.duration) {
            syncLink = null;
            return;
        }

        var p = age / syncLink.duration;
        var fade = Math.sin(Math.min(1, p) * Math.PI);
        var a = syncLink.a, b = syncLink.b;
        var ax = a.x - camera.x, ay = a.y - camera.y;
        var bx = b.x - camera.x, by = b.y - camera.y;
        var dx = bx - ax, dy = by - ay;
        var dist = Math.hypot(dx, dy) || 1;
        var nx = -dy / dist, ny = dx / dist;
        var bend = Math.sin(p * Math.PI * 2) * 12 * (1 - p);
        var cx = (ax + bx) * 0.5 + nx * bend;
        var cy = (ay + by) * 0.5 + ny * bend;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.0 + fade * 1.15;
        ctx.strokeStyle = 'rgba(41,224,196,' + (0.18 + fade * 0.58).toFixed(3) + ')';
        ctx.shadowColor = 'rgba(41,224,196,' + (fade * 0.42).toFixed(3) + ')';
        ctx.shadowBlur = 10 + fade * 12;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx, cy, bx, by);
        ctx.stroke();

        var travel = Math.min(1, p * 1.65);
        var omt = 1 - travel;
        var ex = omt * omt * ax + 2 * omt * travel * cx + travel * travel * bx;
        var ey = omt * omt * ay + 2 * omt * travel * cy + travel * travel * by;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5 + fade * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.72 * fade).toFixed(3) + ')';
        ctx.fill();
        ctx.restore();
    }

    function clipTeamCircle(sx, sy, radius) {
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 0.96, 0, Math.PI * 2);
        ctx.clip();
    }



    function drawSyncBackground(t) {
        // Intentionally empty.
        // The white page background stays unchanged.
        // "Background change" belongs inside each active mint team core.
    }

    function updateAndDrawSyncPair(t, dt) {
        if (!syncEvent) return;
        var age = t - syncEvent.born;

        if (age < 0 || age > syncEvent.duration) {
            if (age > syncEvent.duration) {
                var pair = [syncEvent.a, syncEvent.b];
                for (var ii = 0; ii < pair.length; ii++) {
                    var n = pair[ii];
                    // Restore the ORIGINAL node-circle appearance.
                    n.syncRole = null;
                    n.syncVisual = 0;
                    n.returning = true;
                    n.returnX = n.x;
                    n.returnY = n.y;
                    n.returnVX = 0;
                    n.returnVY = 0;
                }
                syncEvent.teamA.syncEnergy = 0;
                syncEvent.teamB.syncEnergy = 0;
                // Resume at the final world positions, with the motion actually visible at exit.
                [syncEvent.teamA, syncEvent.teamB].forEach(function (team) {
                    team.velocityX = team.syncExitVelocityX ?? team.velocityX;
                    team.velocityY = team.syncExitVelocityY ?? team.velocityY;
                    team.syncResuming = true;
                });
                for (var i = 0; i < blobs.length; i++) {
                    for (var j = i + 1; j < blobs.length; j++) {
                        separationRecovery.set(i + '-' + j, {
                            distance: Math.hypot(blobs[i].currentX - blobs[j].currentX, blobs[i].currentY - blobs[j].currentY),
                            speed: (blobs[i].travelSpeed + blobs[j].travelSpeed) * (reduceMotion ? 0.18 : 1), age: 0
                        });
                    }
                }
                syncEvent = null;
            }
            return;
        }

        var a = syncEvent.a, b = syncEvent.b;

        if (!syncEvent.locked) {
            syncEvent.locked = true;
            // B's location is the temporary SYNC location.
            syncEvent.cx = b.x;
            syncEvent.cy = b.y;
            syncEvent.startAngle = Math.atan2(a.y - b.y, a.x - b.x);
            if (!isFinite(syncEvent.startAngle)) syncEvent.startAngle = 0;
            syncEvent.pairRadius = Math.max(9, Math.min(13, (a.r + b.r) * 1.08));
            syncEvent.patternStarted = false;
        }

        // PHASE 1: nodes connect and revolve at B's position.
        var theta = syncEvent.startAngle + age * 5.2 * syncEvent.spin;
        var r = syncEvent.pairRadius, cx = syncEvent.cx, cy = syncEvent.cy;
        var ax = cx + Math.cos(theta) * r, ay = cy + Math.sin(theta) * r;
        var bx = cx + Math.cos(theta + Math.PI) * r, by = cy + Math.sin(theta + Math.PI) * r;
        var settle = Math.min(1, age / .18);

        if (draggingNode !== a) {
            a.x += (ax - a.x) * Math.min(1, dt * 20 * settle);
            a.y += (ay - a.y) * Math.min(1, dt * 20 * settle);
        }
        if (draggingNode !== b) {
            b.x += (bx - b.x) * Math.min(1, dt * 20 * settle);
            b.y += (by - b.y) * Math.min(1, dt * 20 * settle);
        }

        // BOTH graphic nodes visibly react while they revolve around one another.
        // The effect remains strictly inside each existing graphic node.
        var pairFadeIn = Math.min(1, age / .12);
        var pairFadeOut = Math.min(1, (syncEvent.duration - age) / .45);
        var pairVisual = Math.max(0, Math.min(pairFadeIn, pairFadeOut));
        a.syncVisual = pairVisual;
        b.syncVisual = pairVisual;
        a.syncRole = 'source';
        b.syncRole = 'target';

    }

    function drawSyncRoles(t) {
        if (!syncSourceNode) return;
        function ring(n, source, strength) {
            if (!n) return;
            var sx = n.x - camera.x, sy = n.y - camera.y, rr = Math.max(7, n.r * (n.scale || 1));
            ctx.save();
            if (source) {
                ctx.strokeStyle = 'rgba(255,52,143,' + (.88 * strength).toFixed(3) + ')';
                ctx.lineWidth = 2.3; ctx.beginPath(); ctx.arc(sx, sy, rr + 8 + Math.sin(t * 7) * 1.5, 0, Math.PI * 2); ctx.stroke();
            } else {
                ctx.strokeStyle = 'rgba(35,224,196,' + (.9 * strength).toFixed(3) + ')';
                ctx.lineWidth = 2.3; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -t * 20;
                ctx.beginPath(); ctx.arc(sx, sy, rr + 9, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        }
        ring(syncSourceNode, true, 1);
        if (syncTargetNode) ring(syncTargetNode, false, Math.max(.28, syncTargetStrength));
    }

    function drawOrbits() {
        for (var i = 0; i < blobs.length; i++) {
            var team = blobs[i];
            var sx = team.currentX - camera.x;
            var sy = team.currentY - camera.y;
            if (sx < -team.outerRadius || sx > W + team.outerRadius ||
                sy < -team.outerRadius || sy > H + team.outerRadius) continue;

            ctx.save();
            ctx.strokeStyle = 'rgba(27,67,61,0.25)';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([2.2, 5.2]);
            ctx.lineDashOffset = -team.phase * 5;
            for (var orbitIndex = 0; orbitIndex < 3; orbitIndex++) {
                var orbit = team.orbitRadii[orbitIndex];
                ctx.beginPath();
                ctx.ellipse(sx, sy, orbit.x, orbit.y, team.syncRotation || 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    function drawTeamCores(t) {
        for (var i = 0; i < blobs.length; i++) {
            var team = blobs[i];
            var sx = team.currentX - camera.x;
            var sy = team.currentY - camera.y;
            var radius = TYPOGRAPHY_SIZE / 2;
            if (sx < -radius * 2 || sx > W + radius * 2 || sy < -radius * 2 || sy > H + radius * 2) continue;
            var img = letterImages[i];
            if (!img || !img.complete || !img.naturalWidth) continue;
            var replacement = getSyncTypographyImage(i, t);
            // Keep the existing size/position. Only blend the SVG image during SYNC.
            var replacementOpacity = 0;
            if (replacement && syncEvent) {
                var age = t - syncEvent.born;
                var fadeIn = Math.max(0, Math.min(1, (age - 0.28) / 0.35));
                var fadeOut = Math.max(0, Math.min(1, (syncEvent.duration - age) / 0.45));
                replacementOpacity = Math.min(fadeIn, fadeOut);
            }
            function paintTypography(image, opacity) {
                if (opacity <= 0) return;
                var maxSide = TYPOGRAPHY_SIZE;
                var scale = Math.min(maxSide / image.naturalWidth, maxSide / image.naturalHeight);
                var dw = image.naturalWidth * scale;
                var dh = image.naturalHeight * scale;
                ctx.globalAlpha = opacity;
                ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
            }
            ctx.save();
            // Rotate only the artwork; world coordinates and hit testing stay unchanged.
            ctx.translate(sx, sy);
            ctx.rotate(LETTER_VISUAL_ANGLES[i] * Math.PI / 180);
            paintTypography(img, 1 - replacementOpacity);
            if (replacement) paintTypography(replacement, replacementOpacity);
            ctx.restore();
        }
    }

    function drawTeamInfo() {
        return; // Typography hover labels disabled

        for (var i = 0; i < blobs.length; i++) {
            var team = blobs[i];
            if (team.hoverAmount < 0.002) continue;

            var sx = team.currentX - camera.x;
            var sy = team.currentY - camera.y;
            var radius = team.renderRadius;
            if (sx < -radius || sx > W + radius || sy < -radius || sy > H + radius) continue;

            var info = team.info || TEAM_INFO[team.id];
            var textY = sy + radius * 0.15;

            ctx.save();
            ctx.globalAlpha = team.hoverAmount;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(11,11,10,0.62)';
            ctx.font = '600 16px "JetBrains Mono", ui-monospace, sans-serif';
            ctx.fillText(info.name, sx, textY - 18);

            ctx.fillStyle = 'rgba(11,11,10,0.62)';
            ctx.font = '400 13px "JetBrains Mono", ui-monospace, sans-serif';
            ctx.fillText(info.category, sx, textY + 4);

            ctx.fillStyle = 'rgba(11,11,10,0.62)';
            ctx.font = '400 12px "JetBrains Mono", ui-monospace, sans-serif';
            ctx.restore();
        }
    }

    function updateNodeMotion(n, dt, t) {
        var motionFactor = reduceMotion ? 0.12 : 1;
        var team = blobs[n.team];
        // SVG dimensions can become available after the initial layout.
        var minRadius = getTypographyOrbitRadius(n.team);
        var radiusChange = minRadius - n.minRadius;
        n.minRadius = minRadius;
        n.maxRadius += radiusChange;
        n.homeRadius += radiusChange;

        if (syncEvent && (syncEvent.a === n || syncEvent.b === n) &&
            t >= syncEvent.born && t <= syncEvent.born + syncEvent.duration) {
            n.scale = 1.10 + Math.sin(t * 8 + n.idx) * 0.06;
            return;
        }

        // While one node is dragged, every node in that team moves with it.
        if (draggingNode && n.team === draggingNode.team) {
            if (n.freeDragX !== null) {
                n.x = n.freeDragX;
                n.y = n.freeDragY;
            }
            n.scale = (draggingNode === n) ? 1.10 : 1.02;
            return;
        }

        // Compute the moving home/orbit target first.
        n.orbitAngle += n.orbitSpeed * n.orbitDirection * dt * motionFactor;
        var angularOffset = Math.sin(t * n.driftSpeed + n.driftPhase) * n.angularDrift * motionFactor;
        var radialOffset = Math.sin(t * (n.driftSpeed * 0.73) + n.driftPhase * 1.7) * n.driftAmount * motionFactor;
        var radius = Math.max(n.minRadius, Math.min(n.maxRadius, n.homeRadius + radialOffset));
        var angle = n.orbitAngle + angularOffset;
        n.homeLocalX = Math.cos(n.orbitAngle) * n.homeRadius;
        n.homeLocalY = Math.sin(n.orbitAngle) * n.homeRadius;
        var driftX = Math.sin(t * 0.14 + n.driftPhase * 2.1) * n.driftAmount * 0.45 * motionFactor;
        var driftY = Math.cos(t * 0.12 + n.driftPhase * 1.3) * n.driftAmount * 0.40 * motionFactor;
        var targetX = team.currentX + Math.cos(angle) * radius + driftX;
        var targetY = team.currentY + Math.sin(angle) * radius + driftY;

        if (n.returning) {
            // Spring back to the node's original moving orbit after SYNC/release.
            var spring = 34;
            var damping = 8.4;
            var dx = targetX - n.returnX;
            var dy = targetY - n.returnY;
            n.returnVX += dx * spring * dt;
            n.returnVY += dy * spring * dt;
            var damp = Math.exp(-damping * dt);
            n.returnVX *= damp;
            n.returnVY *= damp;
            n.returnX += n.returnVX * dt;
            n.returnY += n.returnVY * dt;
            n.x = n.returnX;
            n.y = n.returnY;

            if (Math.hypot(dx, dy) < 2.2 && Math.hypot(n.returnVX, n.returnVY) < 8) {
                n.returning = false;
                n.x = targetX;
                n.y = targetY;
            }
        } else {
            n.x = targetX;
            n.y = targetY;
        }

        n.scale = 1 + Math.sin(t * 0.52 + n.idx * 0.81) * 0.035 * motionFactor;
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
            var isDragged = draggingNode === a || draggingNode === b;
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
            var finalAlpha = (0.18 + 0.20 * connection.tension) * connection.strength * connection.alpha;

            if (connection.alpha > 0.002 && easedProgress > 0.002) {
                ctx.save();
                ctx.lineWidth = 0.55 + 0.45 * connection.tension + (isDragged ? 0.06 : 0);
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgba(23,74,67,' + Math.max(0, finalAlpha).toFixed(3) + ')';
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
        var maxDistance = Math.max(680, Math.min(860, Math.min(W, H) * 0.86));

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

    function drawPing(x, y, t) {
        var p = { x: x - camera.x, y: y - camera.y };
        if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) return;
        var cycle = 3.2;
        var local = (t + (x + y) * 0.004) % cycle;
        var progress = local / cycle;
        var r = 4 + progress * 34;
        var alpha = (1 - progress) * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(41,224,196,' + Math.max(0, alpha).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = COLOR_ACCENT_STRONG;
        ctx.fill();
    }

    function drawNode(n, t) {
        var sx = n.x - camera.x;
        var sy = n.y - camera.y;
        var rr = Math.max(6, n.r * (n.scale || 1));
        var isDragging = (draggingNode === n);
        var isHovered = (hoveredNode === n);
        var isActiveTeam = (!!draggingNode && n.team === draggingNode.team) ||
            (!!draggingBlob && n.team === draggingBlob.team);
        var isEmphasized = isDragging || isHovered;
        if (sx < -rr - 30 || sx > W + rr + 30 || sy < -rr - 30 || sy > H + rr + 30) return;

        for (var i = n.pulses.length - 1; i >= 0; i--) {
            var p = n.pulses[i];
            p.t += 1;
            var pr = rr + p.t * 1.6;
            var alpha = Math.max(0, 1 - p.t / 40);
            if (alpha <= 0) { n.pulses.splice(i, 1); continue; }
            ctx.beginPath();
            ctx.arc(sx, sy, pr, 0, Math.PI * 2);
            ctx.strokeStyle = isHovered ? hexToRgba(COLOR_ACCENT_STRONG, alpha * 0.72) :
                ((isDragging ? 'rgba(253,0,160,' : 'rgba(253,0,160,') + (alpha * 0.7).toFixed(3) + ')');
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        if (isHovered) {
            ctx.beginPath();
            ctx.arc(sx, sy, rr + 6 + Math.sin(t * 8) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba(COLOR_ACCENT_STRONG, 0.78);
            ctx.lineWidth = 2.0;
            ctx.stroke();
        }

        ctx.save();
        if (isDragging) {

            ctx.shadowBlur = 12;
        } else if (isHovered) {
            ctx.shadowColor = COLOR_ACCENT_STRONG;
            ctx.shadowBlur = 11;
        } else if (isActiveTeam) {
            ctx.shadowColor = COLOR_ACCENT;
            ctx.shadowBlur = 5;
        } else {
            ctx.shadowColor = 'rgba(11,11,10,0.08)';
            ctx.shadowBlur = 3;
        }
        ctx.shadowOffsetY = 1;

        var sv = n.syncVisual || 0;
        ctx.beginPath();
        ctx.arc(sx, sy, rr, 0, Math.PI * 2);
        if (sv > 0) {
            ctx.fillStyle = n.syncRole === 'source'
                ? COLOR_ACCENT_STRONG
                : COLOR_ACCENT_STRONG;
        } else {
            ctx.fillStyle = (isDragging || isHovered || isActiveTeam) ? COLOR_ACCENT_STRONG : COLOR_ACCENT;
        }
        ctx.fill();

        // Keep synced graphic nodes solid pink; no interior pattern.

        ctx.strokeStyle = sv > 0
            ? (n.syncRole === 'source' ? COLOR_ACCENT_STRONG : COLOR_ACCENT_STRONG)
            : (isEmphasized ? hexToRgba(COLOR_ACCENT_STRONG, 0.92) :
                (isActiveTeam ? COLOR_ACCENT_STRONG : COLOR_ACCENT));
        ctx.lineWidth = sv > 0 ? 1.5 : (isEmphasized ? 1.1 : 0.8);
        ctx.stroke();
        ctx.restore();

    }

    function updateHover(dt) {
        hoveredNode = null;
        hoveredTeam = null;

        if (draggingBlob) {
            hoveredTeam = null;
        } else if (mouse.active) {
            var best = 1e9;
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var d = Math.hypot(mouse.worldX - n.x, mouse.worldY - n.y);
                if (d < n.r + 10 && d < best) {
                    best = d;
                    hoveredNode = n;
                }
            }
        }

        var fadeStep = Math.min(1, dt * 10);
        for (var j = 0; j < blobs.length; j++) {
            var targetHover = 0;
            blobs[j].hoverAmount += (targetHover - blobs[j].hoverAmount) * fadeStep;
            if (blobs[j].hoverAmount < 0.001 && targetHover === 0) blobs[j].hoverAmount = 0;
        }
    }

    function updateClickCursor(dt) {
        var rect = canvas.getBoundingClientRect();
        // Hit-test the page too, so header controls win even during pointer capture.
        var overCanvas = cursorMedia.matches && cursorOnCanvas && mouse.active && host.hasAttribute('data-hero-ready') &&
            document.elementFromPoint(rect.left + mouse.x, rect.top + mouse.y) === host;
        clickCursor.hidden = !overCanvas;
        if (overCanvas) {
            clickCursor.style.transform = 'translate3d(' + (rect.left + mouse.x - 38) + 'px, ' + (rect.top + mouse.y - 38) + 'px, 0)';
            var leaderX = mouse.x;
            var leaderY = mouse.y;
            for (var trailIndex = 0; trailIndex < cursorTrails.length; trailIndex++) {
                var trail = cursorTrails[trailIndex];
                if (!cursorTrailsVisible || reduceMotion) {
                    trail.x = mouse.x;
                    trail.y = mouse.y;
                } else {
                    var follow = 1 - Math.exp(-(18 - trailIndex * 1.8) * dt);
                    trail.x += (leaderX - trail.x) * follow;
                    trail.y += (leaderY - trail.y) * follow;
                    var dx = leaderX - trail.x;
                    var dy = leaderY - trail.y;
                    var distance = Math.hypot(dx, dy);
                    // Keep adjacent layers overlapped, with at most 45px total spread.
                    if (distance > 9) {
                        trail.x = leaderX - dx / distance * 9;
                        trail.y = leaderY - dy / distance * 9;
                    } else if (distance < 0.05) {
                        trail.x = leaderX;
                        trail.y = leaderY;
                    }
                }
                trail.element.hidden = false;
                trail.element.style.transform = 'translate3d(' + (rect.left + trail.x - 38) + 'px, ' + (rect.top + trail.y - 38) + 'px, 0)';
                leaderX = trail.x;
                leaderY = trail.y;
            }
            cursorTrailsVisible = true;
            canvas.style.cursor = 'none';
        } else {
            hideCursorTrails();
            canvas.style.removeProperty('cursor');
        }
    }

    function frame(now) {
        var t = (now - start) / 1000;
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        updateCamera();
        mouse.worldX = mouse.x + camera.x;
        mouse.worldY = mouse.y + camera.y;

        var i;
        var syncPositions = syncEvent ? blobs.map(function (b) { return { x: b.currentX, y: b.currentY }; }) : null;
        for (i = 0; i < blobs.length; i++) updateTeamPosition(blobs[i], t, dt);
        separateBlobs(dt);
        attractSyncTeams(t, dt);
        if (syncPositions && dt > 0) {
            [syncEvent.teamA, syncEvent.teamB].forEach(function (b) {
                var motion = reduceMotion ? 0.18 : 1;
                b.syncExitVelocityX = (b.currentX - syncPositions[b.id].x) / dt / motion;
                b.syncExitVelocityY = (b.currentY - syncPositions[b.id].y) / dt / motion;
            });
        }
        relaxSyncRotations(dt);
        syncDraggedObject();
        for (i = 0; i < nodes.length; i++) updateNodeMotion(nodes[i], dt, t);
        updateHover(dt);
        updateSyncInteraction(t, dt);

        ctx.clearRect(0, 0, W, H);
        drawSyncBackground(t);
        // Orbit guide lines hidden; node movement remains unchanged.
        drawEdges(t, dt);
        drawTeamCores(t);
        drawTeamInfo();
        labelBounds = [];
        for (i = 0; i < nodes.length; i++) drawNode(nodes[i], t);
        updateAndDrawSyncPair(t, dt);
        updateClickCursor(dt);




        animationFrame = requestAnimationFrame(frame);
    }

    var resizeTimer = null;
    function scheduleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = scheduleTimeout(function () {
            resize();
            layout();
        }, 120);
    }
    listen(window, 'resize', scheduleResize);
    var observer = new ResizeObserver(function () {
        if (host.clientWidth !== W || host.clientHeight !== H) scheduleResize();
    });
    observer.observe(host);

    resize();
    layout();

    if (playIntro !== false) {
        scheduleTimeout(function () {
            intro.classList.add('explode');
            scheduleTimeout(function () {
                intro.classList.add('fade');
                scheduleTimeout(function () {
                    // The host reveals the header and canvas together at this completion point.
                    onIntroComplete?.();
    host.setAttribute('data-hero-ready', '');
    intro.remove();
                }, 500);
            }, 650);
        }, 2000);
    } else {
        intro.remove();
    }
    animationFrame = requestAnimationFrame(frame);

    return () => {
        hideClickCursor();
        cursorLayer.remove();
        events.abort();
        observer.disconnect();
        cancelAnimationFrame(animationFrame);
        timers.forEach(clearTimeout);
        timers.clear();
    };
}

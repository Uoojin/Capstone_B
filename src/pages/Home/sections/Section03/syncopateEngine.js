
export function startSyncopate(canvas) {

  // ───────────────────────── Measured constants ─────────────────────────
  // Everything is expressed in the original 1920×320 video pixel space.
  const W = 1920, H = 320;
  const BG = [255, 255, 255];
  const INK = [253, 0, 160];
  const FONT_FAMILY = '"Helvetica Neue", "Pretendard"';
  const FONT_WEIGHT = 500;

  // Timeline is laid out in 59.94 fps ticks; the video is one motion-blurred exposure per 29.97 fps frame.
  const SRC_FPS = 60000 / 1001;
  const VID_FPS = 30000 / 1001;
  const PERIOD = 480 / SRC_FPS;           // 8.008 s loop
  const PHASE = 120 / SRC_FPS;            // a transition every 2.002 s
  const CFG = {
    FONT_SIZE: 150,
    LETTER_SPACING: -0.5,
    T_BASE: 0.167146,                 // first transition start
    STAGGER: 4 / SRC_FPS,                 // 1/15 s between elements
    DUR: 1.001,                           // per-element duration (60 ticks)
    EASE: [1, 0, 0, 1],                   // cubic-bezier control points
    SHUTTER_ANGLE: 155,                   // motion-blur shutter, degrees of a 29.97 fps frame, centred
    SHUTTER_SEGMENTS: 24,                 // piecewise-linear segments integrated per exposure
    OPATE_SHIFT: 642,                     // OPATE starts this far right of its rest spot
    // Progress at which each top-line slot swaps to its new glyph, per transition.
    SWAP: [
      [0.518, 0.474, 0.474, 0.474],
      [0.518, 0.518, 0.518, 0.518],
      [0.518, 0.474, 0.474, 0.474],
      [0.518, 0.518, 0.518, 0.518],
    ],
    // Ink-left x of each glyph and baseline of each line (video px).
    BASELINE: [142.4, 308.4],
    TOP: {
      LETS: [[['L', 62.42]], [['E', 158.80]], [['T', 257.37], ['’', 367.59]], [['S', 402.31]]],
      PULL: [[['P', 1443.89]], [['U', 1553.88]], [['L', 1681.32]], [['L', 1781.82]]],
      PLAY: [[['P', 1460.67]], [['L', 1572.67]], [['A', 1669.23]], [['Y', 1775.72]]],
    },
    SYNC: [['S', 56.30], ['Y', 157.36], ['N', 279.27], ['C', 393.80]],
    SYNC_R: [['S', 885.69], ['Y', 986.72], ['N', 1108.71], ['C', 1223.49]],
    OPATE: [['O', 1345.41], ['P', 1481.88], ['A', 1566.45], ['T', 1665.67], ['E', 1776.73]],
  };

  // Four transitions per loop: out to PULL, back, out to PLAY, back.
  // The original lands the last return exactly 1px left of where the loop starts; kept as-is.
  const TRANSITIONS = [
    { from: 'LETS', to: 'PULL', out: true, shift: 0 },
    { from: 'PULL', to: 'LETS', out: false, shift: 0 },
    { from: 'LETS', to: 'PLAY', out: true, shift: 0 },
    { from: 'PLAY', to: 'LETS', out: false, shift: -1 },
  ];

  // ───────────────────────── Easing: cubic-bezier(1, 0, 0, 1) ─────────────────────────
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = s => ((ax * s + bx) * s + cx) * s;
    const sy = s => ((ay * s + by) * s + cy) * s;
    const dsx = s => (3 * ax * s + 2 * bx) * s + cx;
    function solve(x) {
      let lo = 0, hi = 1, s = x;
      for (let i = 0; i < 8; i++) {
        const d = dsx(s);
        if (Math.abs(d) < 1e-6) break;
        const e = sx(s) - x;
        if (Math.abs(e) < 1e-7) return s;
        s -= e / d;
      }
      s = x;
      for (let i = 0; i < 40; i++) {
        const v = sx(s);
        if (Math.abs(v - x) < 1e-7) break;
        if (v < x) lo = s; else hi = s;
        s = (lo + hi) / 2;
      }
      return s;
    }
    return {
      value(u) {
        if (u <= 0) return 0;
        if (u >= 1) return 1;
        return sy(solve(u));
      },
    };
  }
  let EASE = null, easeKey = '';
  function ease(u) {
    const key = CFG.EASE.join();
    if (key !== easeKey) { EASE = bezier(...CFG.EASE); easeKey = key; }
    return EASE.value(u);
  }

  // ───────────────────────── Scene evaluation ─────────────────────────
  let lsb = {}; // ink-left offset from pen origin, video px, filled after glyph rasterisation

  const originOf = (ch, inkX) => inkX - lsb[ch];
  const tighten = (list) =>
    list.map(([ch, x], i) => [ch, x + i * CFG.LETTER_SPACING]);

  // Every element at time t as {line, o, glyphs: [[ch, ink-left relative to o]]}.
  // Always the same 13 elements in the same order, so samples across a shutter window line up.
  function elementsAt(t) {
    t = ((t % PERIOD) + PERIOD) % PERIOD;
    // Latest transition that has started (before the first one, the first one's start state).
    let k = 0;
    for (let i = TRANSITIONS.length - 1; i > 0; i--) {
      if (t >= CFG.T_BASE + i * PHASE) { k = i; break; }
    }
    const start = CFG.T_BASE + k * PHASE;
    const tr = TRANSITIONS[k];
    const shifted = list => list.map(([ch, x]) => [ch, x + tr.shift]);
    const progress = t0 => {
      const u = (t - t0) / CFG.DUR;
      return { u, e: ease(u) };
    };
    const out = [];

    // Bottom line — first element of the stagger.
    const a = tighten(tr.out ? CFG.SYNC : CFG.SYNC_R);
    const b = tighten(tr.out ? CFG.SYNC_R : shifted(CFG.SYNC));
    const mb = progress(start);
    for (let i = 0; i < a.length; i++) {
      const oa = originOf(a[i][0], a[i][1]), ob = originOf(b[i][0], b[i][1]);
      out.push({ line: 1, o: oa + (ob - oa) * mb.e, glyphs: [[a[i][0], lsb[a[i][0]]]] });
    }
    const off = tr.out ? CFG.OPATE_SHIFT * (1 - mb.e) : CFG.OPATE_SHIFT * mb.e;
    for (const [ch, x] of tighten(CFG.OPATE)) out.push({ line: 1, o: x + off, glyphs: [[ch, 0]] });

    // Top line — four slots, staggered in their direction of travel; each swaps glyph mid-flight.
    const tightenTop = slots =>
      slots.map((slot, i) =>
        slot.map(([ch, x]) => [ch, x + i * CFG.LETTER_SPACING])
      );

    const A = tightenTop(CFG.TOP[tr.from]);
    const B = tightenTop(CFG.TOP[tr.to].map(shifted));
    const order = tr.out ? [3, 2, 1, 0] : [0, 1, 2, 3];
    for (let s = 0; s < 4; s++) {
      const ga = A[s], gb = B[s];
      const oa = originOf(ga[0][0], ga[0][1]), ob = originOf(gb[0][0], gb[0][1]);
      const m = progress(start + (order.indexOf(s) + 1) * CFG.STAGGER);
      const g = m.u < CFG.SWAP[k][s] ? ga : gb;
      const base = originOf(g[0][0], g[0][1]);
      out.push({ line: 0, o: oa + (ob - oa) * m.e, glyphs: g.map(([ch, x]) => [ch, x - base]) });
    }
    return out;
  }

  // Draw items {ch, line, x (ink-left), blur (box length), w (weight)} for one displayed frame.
  // Motion blur integrates the real path across the shutter: the window is cut into segments and
  // each segment contributes a box blur spanning exactly the distance travelled during it.
  // Near the ease's mid-point the glyphs race through, so the exposure splits into two smeared ghosts.
  // Video-exact mode holds each 29.97 fps frame; smooth mode exposes at the display time.
  function itemsAt(t, mode) {
    const tc = mode === 'video' ? Math.floor(t * VID_FPS + 1e-6) / VID_FPS : t;
    const len = CFG.SHUTTER_ANGLE / 360 / VID_FPS;
    const open = tc - len / 2;
    const N = CFG.SHUTTER_SEGMENTS;
    const out = [];
    const pts = [];
    for (let i = 0; i <= 2 * N; i++) pts.push(elementsAt(open + len * i / (2 * N)));
    for (let e = 0; e < pts[0].length; e++) {
      let still = true;
      for (let i = 1; i <= 2 * N && still; i++) {
        still = Math.abs(pts[i][e].o - pts[0][e].o) < 1e-3 && pts[i][e].glyphs[0][0] === pts[0][e].glyphs[0][0];
      }
      if (still) {
        const el = pts[N][e];
        for (const [ch, dx] of el.glyphs) out.push({ ch, line: el.line, x: el.o + dx, blur: 0, w: 1 });
        continue;
      }
      for (let s = 0; s < N; s++) {
        const oa = pts[2 * s][e].o, ob = pts[2 * s + 2][e].o, mid = pts[2 * s + 1][e];
        const c = (oa + ob) / 2;
        for (const [ch, dx] of mid.glyphs) out.push({ ch, line: mid.line, x: c + dx, blur: Math.abs(ob - oa), w: 1 / N });
      }
    }
    return out;
  }

  // ───────────────────────── WebGL2 renderer ─────────────────────────
  if (!canvas) return () => { };
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) { console.error('Syncopate requires WebGL2'); return () => { }; }

  const VS = `#version 300 es
  in vec2 aPos;
  uniform vec4 uRect;   // x, y, w, h in device px (top-left origin)
  uniform vec2 uView;
  void main() {
    vec2 p = uRect.xy + aPos * uRect.zw;
    vec2 clip = vec2(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0);
    gl_Position = vec4(clip, 0.0, 1.0);
  }`;

  // Exact horizontal box blur: integrate the glyph's row-wise prefix sum over [u - L/2, u + L/2].
  const FS_GLYPH = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  uniform sampler2D uPrefix;  // R32F, (w + 1) × h
  uniform vec2 uInk;          // ink-left, top (device px)
  uniform float uGW, uGH, uL, uWeight, uViewH;
  out vec4 o;
  float F(float x, int row) {
    x = clamp(x, 0.0, uGW);
    int i = int(min(floor(x), uGW - 1.0));
    float f = x - float(i);
    float a = texelFetch(uPrefix, ivec2(i, row), 0).r;
    float b = texelFetch(uPrefix, ivec2(i + 1, row), 0).r;
    return a + f * (b - a);
  }
  void main() {
    vec2 p = vec2(gl_FragCoord.x, uViewH - gl_FragCoord.y);
    float ry = p.y - uInk.y;
    if (ry < 0.0 || ry >= uGH) discard;
    int row = int(floor(ry));
    float u = p.x - uInk.x;
    float L = max(uL, 1.0);
    float c = (F(u + 0.5 * L, row) - F(u - 0.5 * L, row)) / L;
    o = vec4(c * uWeight, 0.0, 0.0, 1.0);
  }`;

  const FS_COMPOSE = `#version 300 es
  precision highp float;
  uniform sampler2D uCov;
  uniform vec3 uBg, uInk;
  uniform vec2 uView;
  out vec4 o;
  void main() {
    float c = clamp(texelFetch(uCov, ivec2(gl_FragCoord.xy), 0).r, 0.0, 1.0);
    o = vec4(mix(uBg, uInk, c), 1.0);
  }`;

  function program(vs, fs) {
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i).name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  }

  const progGlyph = program(VS, FS_GLYPH);
  const progCompose = program(VS, FS_COMPOSE);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const hasFloatTarget = !!gl.getExtension('EXT_color_buffer_float');

  let scale = 1, viewW = 0, viewH = 0;
  let covTex = null, covFbo = null;
  let glyphs = {}; // key `${ch}|${line}` → {tex, w, h, inkX (device, rel. origin), top (device px)}

  function makeTarget() {
    if (covTex) gl.deleteTexture(covTex);
    if (covFbo) gl.deleteFramebuffer(covFbo);
    covTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, covTex);
    if (hasFloatTarget) gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, viewW, viewH, 0, gl.RED, gl.HALF_FLOAT, null);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, viewW, viewH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    covFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, covFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, covTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  // Rasterise each glyph once per size with its line's sub-pixel baseline baked in,
  // then store row-wise prefix sums so the shader can box-blur any length in O(1).
  function buildGlyphs() {
    for (const g of Object.values(glyphs)) gl.deleteTexture(g.tex);
    glyphs = {};
    lsb = {};
    const chars = [...new Set('LET’SPULAYNCO')];
    const px = CFG.FONT_SIZE * scale;
    const pad = Math.ceil(px * 0.3);
    const cw = Math.ceil(px * 1.2) + pad * 2, ch = Math.ceil(px * 1.3) + pad * 2;
    const cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.font = `${FONT_WEIGHT} ${px}px ${FONT_FAMILY}`;
    cx.textBaseline = 'alphabetic';
    for (let line = 0; line < 2; line++) {
      const by = CFG.BASELINE[line] * scale;
      const frac = by - Math.floor(by);
      const originY = pad + Math.ceil(px);
      for (const c of chars) {
        cx.clearRect(0, 0, cw, ch);
        cx.fillStyle = '#fff';
        cx.fillText(c, pad, originY + frac);
        const data = cx.getImageData(0, 0, cw, ch).data;
        let x0 = cw, x1 = -1, y0 = ch, y1 = -1;
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          if (data[(y * cw + x) * 4 + 3] > 0) {
            if (x < x0) x0 = x; if (x > x1) x1 = x;
            if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
        const w = x1 - x0 + 1, h = y1 - y0 + 1;
        const prefix = new Float32Array((w + 1) * h);
        for (let y = 0; y < h; y++) {
          let acc = 0;
          for (let x = 0; x < w; x++) {
            acc += data[((y + y0) * cw + x + x0) * 4 + 3] / 255;
            prefix[y * (w + 1) + x + 1] = acc;
          }
        }
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, w + 1, h, 0, gl.RED, gl.FLOAT, prefix);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        glyphs[`${c}|${line}`] = { tex, w, h, inkX: x0 - pad, top: Math.floor(by) + (y0 - originY) };
        if (line === 0) lsb[c] = (x0 - pad) / scale;
      }
    }
  }

  function draw(items) {
    gl.viewport(0, 0, viewW, viewH);
    gl.bindFramebuffer(gl.FRAMEBUFFER, covFbo);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(progGlyph.p);
    const u = progGlyph.u;
    gl.uniform2f(u.uView, viewW, viewH);
    gl.uniform1f(u.uViewH, viewH);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(u.uPrefix, 0);
    for (const it of items) {
      const g = glyphs[`${it.ch}|${it.line}`];
      const L = it.blur * scale;
      const inkX = it.x * scale;
      const x0 = inkX - Math.max(L, 1) / 2 - 1;
      const x1 = inkX + g.w + Math.max(L, 1) / 2 + 1;
      if (x1 < 0 || x0 > viewW) continue;
      gl.bindTexture(gl.TEXTURE_2D, g.tex);
      gl.uniform4f(u.uRect, Math.floor(x0), g.top, Math.ceil(x1) - Math.floor(x0), g.h);
      gl.uniform2f(u.uInk, inkX, g.top);
      gl.uniform1f(u.uGW, g.w);
      gl.uniform1f(u.uGH, g.h);
      gl.uniform1f(u.uL, L);
      gl.uniform1f(u.uWeight, it.w);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(progCompose.p);
    const c = progCompose.u;
    gl.uniform4f(c.uRect, 0, 0, viewW, viewH);
    gl.uniform2f(c.uView, viewW, viewH);
    gl.uniform3f(c.uBg, BG[0] / 255, BG[1] / 255, BG[2] / 255);
    gl.uniform3f(c.uInk, INK[0] / 255, INK[1] / 255, INK[2] / 255);
    gl.bindTexture(gl.TEXTURE_2D, covTex);
    gl.uniform1i(c.uCov, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ───────────────────────── Sizing & playback ─────────────────────────
  const params = new URLSearchParams(window.location.search);
  const state = {
    mode: params.get('mode') === 'smooth' ? 'smooth' : 'video',
    playing: true,
    speed: 1,
    time: 0,
    fixedWidth: params.has('w') ? +params.get('w') : 0,
  };

  function resize() {
    const dpr = state.fixedWidth ? 1 : (window.devicePixelRatio || 1);
    const cssW = state.fixedWidth || canvas.getBoundingClientRect().width || window.innerWidth;
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(w * H / W));
    if (w === viewW && h === viewH) return;
    viewW = canvas.width = w;
    viewH = canvas.height = h;
    scale = w / W;
    makeTarget();
    buildGlyphs();
  }

  function renderAt(t) {
    resize();
    draw(itemsAt(t, state.mode));
  }


  let last = null;
  let disposed = false;
  let raf = 0;
  function frame(now) {
    if (last !== null && state.playing) state.time = (state.time + (now - last) / 1000 * state.speed) % PERIOD;
    last = now;
    renderAt(state.time);
    if (!disposed) raf = requestAnimationFrame(frame);
  }


  // No global keyboard shortcuts inside the branding website.
  const onResize = () => { viewW = 0; };
  window.addEventListener('resize', onResize);

  // Hook for tooling: render a specific time synchronously.
  // Instance-scoped controls are returned to React instead of being attached globally.

  const start = () => { if (!disposed) raf = requestAnimationFrame(frame); };
  if (params.has('paused')) { state.playing = false; state.time = +params.get('paused') || 0; }
  (document.fonts && document.fonts.load ? document.fonts.load(`${FONT_WEIGHT} ${CFG.FONT_SIZE}px ${FONT_FAMILY}`) : Promise.resolve()).then(start, start);
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);


    window.removeEventListener('resize', onResize);
    for (const g of Object.values(glyphs)) gl.deleteTexture(g.tex);
    if (covTex) gl.deleteTexture(covTex);
    if (covFbo) gl.deleteFramebuffer(covFbo);
    gl.deleteBuffer(quad);
    gl.deleteProgram(progGlyph.p);
    gl.deleteProgram(progCompose.p);
  };
}

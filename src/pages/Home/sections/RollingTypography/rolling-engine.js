// Movement, rotation, thresholds and pointer arithmetic ported from the supplied HTML.
export function startRolling(root, artwork, applyArtwork) {
  let frame = 0, running = false;
  const cleanups = [];
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  const viewport = root.querySelector('.track-viewport');
  const track = root.querySelector('.letter-track');
  const originals = [...track.querySelectorAll('.letter')];
  const progress = root.querySelector('#progress-fill');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const SPEED = 235;
  let dragging = false, pointerId = null, dragX = 0;
  let cycleWidth = 0, offset = 0, elapsed = 0, last = 0, started = false;
  let balls = [];
  function rebuild() {
    track.replaceChildren(...originals);
    cycleWidth = originals.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
    if (!cycleWidth) return;
    const count = Math.max(2, Math.ceil(viewport.clientWidth / cycleWidth) + 2);
    for (let j = 1; j < count; j++) originals.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    balls = [...track.querySelectorAll('.letter')].map((el, i) => ({
      el, id: i % originals.length,
      pink: el.querySelector('.pink'), color: el.querySelector('.color'),
      assetKey: el.dataset.assetKey, variant: -1, nextDecoration: 0,
      radius: el.getBoundingClientRect().width / 2,
      phase: (i % originals.length) * .85,
      rollFactor: .91 + (i % originals.length % 4) * .055
    }));
    if (!started) {
      // Account for the existing track margin: only 18% of the first circle
      // is inside the panel. Every later circle stays outside its right edge.
      const margin = parseFloat(getComputedStyle(track).marginLeft) || 0;
      offset = margin - viewport.clientWidth + originals[0].getBoundingClientRect().width * .18;
      started = true;
    }
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }
  
  function animate(now) {
    if (!running) return;
    if (!last) last = now;
    const dt = Math.min((now-last)/1000, .05);
    last = now;
    if (!reduced.matches && cycleWidth) {
      elapsed += dt;
      if (!dragging) offset += SPEED * dt;
      // Once the first full sequence has passed, repeat seamlessly.
      if (offset >= cycleWidth) offset %= cycleWidth;
      if (offset < 0 && started && elapsed > 0 && offset > -viewport.clientWidth) { /* initial entrance */ }
      else if (offset < -viewport.clientWidth) offset = -viewport.clientWidth;
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      balls.forEach(b => {
        // Rolling without slipping: rotation (radians) = travelled distance / radius.
        // Leftward travel means counterclockwise rotation in screen coordinates.
        const distance = (offset + viewport.clientWidth) * b.rollFactor;
        const angle = -(distance / Math.max(1,b.radius)) * 180 / Math.PI - b.phase * 18;
        b.el.style.transform = `rotate(${angle}deg)`;
        // Each ball starts gray on entry, then becomes magenta, then colorful.
        // Use the ball's own screen position, not global elapsed time.
        // A rotated square's bounding box grows even though the circle does
        // not. Use its invariant center and actual diameter for SVG state only.
        const rect = b.el.getBoundingClientRect();
        const diameter = Math.max(1, b.el.offsetWidth);
        const left = rect.left + rect.width / 2 - diameter / 2;
        const viewportRect = viewport.getBoundingClientRect();
        if (left >= viewportRect.right || left + diameter <= viewportRect.left) {
          // Reset while fully clipped, before the next right-hand entrance.
          if (b.variant !== -1) applyArtwork(b.color.querySelector('img'), artwork[b.assetKey].basic);
          b.variant = -1;
          b.nextDecoration = 0;
          b.pink.style.opacity = '0';
          b.color.style.opacity = '0';
          return;
        }
        const entered = viewportRect.right - left;
        // Two quick elastic color POPs as each ball rolls into view.
        // No directional wipe: the entire artwork changes together.
        const ease = t => {
          const x = Math.max(0, Math.min(1, t));
          return x*x*(3-2*x);
        };
        // Start the existing color timeline when the artwork center crosses
        // the panel edge, so the glyph itself is visibly gray before magenta.
        const position = entered / diameter - .5;
        // Gray at entry, then a quick magenta snap, followed by a second
        // distinct colorful pop. Both are individual to each moving ball.
        const magentaMix = ease((position - 0.30) / 0.105);
        const colorfulMix = ease((position - 1.03) / 0.105);
        // Short, elastic 2D pop at each color change, without 3D or wipes.
        const pulse = center => {
          const d = Math.abs(position - center);
          return Math.exp(-Math.pow(d / 0.115, 2));
        };
        const pop = Math.max(pulse(0.3525), pulse(1.0825));
        const stretch = 1 + pop * 0.065;
        // The supplied source calculates stretch but does not apply it.
        void stretch;
        if (colorfulMix > 0 && (b.nextDecoration === 0 || elapsed >= b.nextDecoration)) {
          const variants = artwork[b.assetKey].variants;
          // Choose from all other variants so consecutive frames never select
          // the same artwork at a scheduled change (unless only one exists).
          let next = Math.floor(Math.random() * Math.max(1, variants.length - (b.variant >= 0 ? 1 : 0)));
          if (b.variant >= 0 && next >= b.variant && variants.length > 1) next += 1;
          applyArtwork(b.color.querySelector('img'), variants[next]);
          b.variant = next;
          b.nextDecoration = elapsed + 2;
        }
        b.el.style.transform = `rotate(${angle}deg)`;
        b.pink.style.opacity = String(magentaMix);
        b.color.style.opacity = String(colorfulMix);
        b.color.style.webkitMaskImage = 'none';
        b.color.style.maskImage = 'none';
        b.color.style.filter = 'none';
        b.pink.style.filter = 'none';
      });
      progress.style.transform = `scaleX(${(elapsed / 12) % 1})`;
    }
    frame=requestAnimationFrame(animate);
  }
  listen(viewport, 'pointerdown', e => {
    if (!running || (e.button !== 0 && e.pointerType === 'mouse')) return;
    dragging = true; pointerId = e.pointerId; dragX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  });
  listen(viewport, 'pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const delta = e.clientX - dragX;
    offset -= delta;
    if (cycleWidth && offset >= cycleWidth) offset %= cycleWidth;
    if (cycleWidth && offset < 0 && offset < -viewport.clientWidth) offset = cycleWidth + (offset % cycleWidth);
    dragX = e.clientX;
  });
  const endDrag = e => {
    if (e.pointerId !== pointerId) return;
    dragging = false; pointerId = null;
    viewport.classList.remove('is-dragging');
  };
  listen(viewport, 'pointerup', endDrag);
  listen(viewport, 'pointercancel', endDrag);
  listen(viewport, 'dragstart', e => e.preventDefault());
  listen(window, 'resize', () => { if (running) rebuild(); else reset(); }, {passive:true});

  const reset = () => {
    dragging = false;
    if (pointerId !== null && viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    pointerId = null;
    viewport.classList.remove('is-dragging');
    elapsed = 0; last = 0; started = false;
    // Clear source transforms before measuring, including after a resize.
    originals.forEach(el => { el.style.transform = 'rotate(0deg)'; });
    rebuild();
    balls.forEach(b => {
      const basic = artwork[b.assetKey].basic;
      b.el.querySelectorAll('.artwork img').forEach(img => applyArtwork(img, basic));
      b.pink.style.opacity = '0'; b.color.style.opacity = '0';
      b.variant = -1; b.nextDecoration = 0;
      const distance = (offset + viewport.clientWidth) * b.rollFactor;
      const angle = -(distance / Math.max(1,b.radius)) * 180 / Math.PI - b.phase * 18;
      b.el.style.transform = `rotate(${angle}deg)`;
    });
    progress.style.transform = 'scaleX(0)';
  };
  reset();

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
    cleanups.forEach(cleanup => cleanup());
    if (pointerId !== null && viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    track.replaceChildren(...originals);
  };
  stop.setVisible = visible => {
    if (visible === running) return;
    running = visible;
    cancelAnimationFrame(frame);
    last = 0;
    if (running) frame = requestAnimationFrame(animate);
    else reset();
  };
  return stop;
}

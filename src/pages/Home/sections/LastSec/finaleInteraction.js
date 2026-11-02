export default function createFinaleInteraction(svg) {
  // ---- 타이밍 설정 -------------------------------------------------
  const BG_RIPPLE_MS   = 900;   // 배경 글자가 퍼지며 나타나는 총 시간
  const FG_START_MS    = 500;   // 앞 글자 팡! 시작 시점
  // eslint-disable-next-line no-unused-vars -- Preserved reference constant.
  const FG_STEP_MS     = 140;   // 앞 글자 사이 간격
  const SHOW_FG        = true;  // 가운데 큰 글자/문구 등장
  const SHUFFLE_DELAY  = 700;   // 앞 글자가 다 나온 뒤 배경이 바뀌기 시작하기까지 딜레이
  const SHUFFLE_EVERY  = [260, 620]; // 랜덤 교체 간격(ms) 범위
  const SWAP_MS        = 1100;  // 글자 하나가 바뀌는 데 걸리는 시간
  const RESET_ON_LEAVE = true;  // 마우스가 나가면 ㅋㅋㅋㅋ 상태로 되돌림
  // 앞 글자 등장 순서(문서 순서 기준 인덱스): L E T ' S S Y N C .
  // eslint-disable-next-line no-unused-vars -- The reference uses POP delays below.
  const FG_ORDER = [3, 0, 6, 9, 7, 5, 2, 8, 1, 4];
  // 팝 프리뷰 기준값 (문서 순서: E C Y L . S T s N ')
  const POP = [
    { d: .20, r: 5,  x: 343.4,  y: 397.0 }, { d: .76, r: -8, x: 1553.1, y: 464.6 },
    { d: .60, r: -4, x: 1248.3, y: 453.0 }, { d: .12, r: -7, x: 227.1,  y: 557.6 },
    { d: .84, r: 8,  x: 1763.0, y: 556.2 }, { d: .52, r: 6,  x: 1052.6, y: 536.0 },
    { d: .28, r: -5, x: 599.9,  y: 442.0 }, { d: .36, r: 8,  x: 743.7,  y: 596.0 },
    { d: .68, r: 7,  x: 1394.4, y: 617.1 }, { d: .44, r: -6, x: 795.2,  y: 338.1 },
  ];
  const COLORS = ['#FF4BBD', '#29C2FF', '#FD00A0', '#B156D8', '#4EEDCD', '#FDB549', '#8481F6'];

  const NS = 'http://www.w3.org/2000/svg';
  const art = svg.querySelector('[data-finale-part="art"]');
  const bg  = svg.querySelector('[data-finale-part="bg"]');
  const fx  = svg.querySelector('[data-finale-part="fx"]');
  const ph  = [...svg.querySelector('[data-finale-part="ph"]').children];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const center = el => { const b = el.getBBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
  const wrap = (els, cls) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', cls);
    els[0].parentNode.insertBefore(g, els[0]);
    els.forEach(e => g.appendChild(e));
    return g;
  };
  const originalGroups = [...svg.querySelectorAll('g')].map(group => [group, [...group.childNodes]]);
  const originalStyles = [...svg.querySelectorAll('*')].map(element => [element, element.getAttribute('style')]);
  const HIDDEN = el => { el.style.transform = 'scale(0)'; el.style.opacity = '0'; };

  // ---- 배경 글자: 인접한 path를 글자 하나로 묶기 -----------------------
  const clusters = [];
  [...bg.children].forEach(p => {
    const c = center(p), last = clusters[clusters.length - 1];
    if (last && Math.hypot(c.x - last.x, c.y - last.y) < 40) last.els.push(p);
    else clusters.push({ x: c.x, y: c.y, els: [p] });
  });
  clusters.forEach(c => {
    const slot = wrap(c.els, 'slot');
    c.slot = slot;
    c.pop = wrap(c.els, 'pop');
    slot.appendChild(c.pop);
    HIDDEN(c.pop);
  });
  const slots = clusters.map(c => ({ x: c.x, y: c.y }));
  clusters.forEach((c, i) => (c.slotIdx = i));

  // ---- 앞 글자 + 하단 문구 ---------------------------------------------
  const fgPaths = [...art.children].filter(e => e.tagName === 'path' && e.hasAttribute('fill'));
  const letters = [];
  for (let i = 0; i < fgPaths.length; i += 3) {
    const g = wrap(fgPaths.slice(i, i + 3), 'fg');
    HIDDEN(g);
    letters.push(g);
  }
  const caption = wrap(
    [art.querySelector(':scope > use'), art.querySelector(':scope > path[mask]')], 'fg'
  );
  caption.setAttribute('transform', 'translate(0 50)');
  caption.style.opacity = '0';
  // The caption is outlined SVG text: separate existing subpaths by their
  // original line bands without changing any glyph coordinates or wrapping.
  const captionUse = caption.querySelector('use');
  const captionOutline = caption.querySelector('path[mask]');
  const captionHref = captionUse.getAttribute('href') || captionUse.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  const captionPath = svg.querySelector(`[id="${captionHref.slice(1)}"]`);
  const fragments = captionPath.getAttribute('d').match(/M[^M]*/g).map(path => ({
    path, y: Number(/^M[-\d.]+[ ,]+([-\d.]+)/.exec(path)[1]),
  }));
  const positions = [...new Set(fragments.map(fragment => fragment.y))].sort((a, b) => a - b);
  const lineStarts = positions.filter((y, index) => index === 0 || y - positions[index - 1] > 12);
  const captionLines = lineStarts.map((top, index) => {
    const bottom = lineStarts[index + 1] ?? Infinity;
    const path = fragments.filter(fragment => fragment.y >= top && fragment.y < bottom)
      .map(fragment => fragment.path).join('');
    const line = document.createElementNS(NS, 'g');
    line.setAttribute('class', 'home-sync-finale-caption-line');
    const fill = document.createElementNS(NS, 'path');
    fill.setAttribute('d', path);
    fill.setAttribute('fill', captionUse.getAttribute('fill'));
    const outline = captionOutline.cloneNode(false);
    outline.setAttribute('d', path);
    line.append(fill, outline);
    line.style.opacity = '0';
    return line;
  });
  caption.replaceChildren(...captionLines);

  // ---- 애니메이션 관리 --------------------------------------------------
  let token = 0;
  const running = new Set(), timers = new Set();
  let disposed = false;
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (!disposed) fn(); }, ms); timers.add(t); };
  const play = (el, frames, opts) => {
    const a = el.animate(frames, { fill: 'forwards', ...opts });
    running.add(a);
    a.onfinish = () => { try { a.commitStyles(); } catch { /* Some browsers cannot commit SVG animation styles. */ } a.cancel(); running.delete(a); };
    return a;
  };

  // eslint-disable-next-line no-unused-vars -- Defined but not invoked by the reference.
  function burst(el) {
    const { x, y } = center(el), b = el.getBBox(), r = Math.max(b.width, b.height) / 2;
    const ring = document.createElementNS(NS, 'circle');
    ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.setAttribute('r', r * 0.7);
    ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', COLORS[Math.floor(rnd(0, COLORS.length))]);
    ring.setAttribute('stroke-width', 8);
    fx.appendChild(ring);
    const ringAnimation = ring.animate([{ transform: 'scale(.6)', opacity: .9 }, { transform: 'scale(1.6)', opacity: 0 }],
      { duration: 520, easing: 'cubic-bezier(.1,.7,.3,1)' });
    running.add(ringAnimation);
    ringAnimation.onfinish = () => { running.delete(ringAnimation); ring.remove(); };
    ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2 + rnd(-.25, .25), d = r + rnd(40, 110), s = rnd(5, 11);
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', s);
      dot.setAttribute('fill', COLORS[i % COLORS.length]);
      fx.appendChild(dot);
      const dotAnimation = dot.animate([
        { transform: 'translate(0,0) scale(.3)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * d}px,${Math.sin(ang) * d}px) scale(1)`, opacity: 1, offset: .55 },
        { transform: `translate(${Math.cos(ang) * (d + 24)}px,${Math.sin(ang) * (d + 24)}px) scale(0)`, opacity: 0 },
      ], { duration: rnd(520, 760), easing: 'cubic-bezier(.15,.8,.3,1)' });
      running.add(dotAnimation);
      dotAnimation.onfinish = () => { running.delete(dotAnimation); dot.remove(); };
    }
  }

  // ---- 재생 -------------------------------------------------------------
  function reveal(px, py) {
    const my = ++token;
    // 1) ㅋㅋㅋㅋ 도형이 사라지며 그 자리에 첫 번째 SVG의 배경 글자가 차근차근 퍼짐
    const maxD = Math.hypot(1920, 1080);
    clusters.forEach((c, i) => {
      const d = Math.hypot(slots[i].x - px, slots[i].y - py) / maxD * BG_RIPPLE_MS + rnd(0, 60);
      later(() => {
        play(ph[i], [{ transform: 'scale(1) rotate(0)', opacity: 1 },
                     { transform: 'scale(1.3) rotate(45deg)', opacity: 1, offset: .35 },
                     { transform: 'scale(0) rotate(120deg)', opacity: 0 }],
             { duration: 380, easing: 'ease-in' });
      }, d);
      later(() => {
        play(c.pop, [{ transform: 'scale(0) rotate(-40deg)', opacity: 0 },
                     { transform: 'scale(1.25) rotate(8deg)', opacity: 1, offset: .6 },
                     { transform: 'scale(1) rotate(0)', opacity: 1 }],
             { duration: 520, easing: 'cubic-bezier(.2,.8,.3,1)' });
      }, d + 180);
    });

    // 2) 앞 글자가 순서대로 팡!
    if (SHOW_FG) letters.forEach((g, i) => {
      const p = POP[i], r = p.r;
      later(() => {
        g.style.transformBox = 'view-box';
        g.style.transformOrigin = `${p.x}px ${p.y}px`;
        play(g, [
          { transform: `scale(0) rotate(${r}deg)`, opacity: 0, easing: 'cubic-bezier(.2,.9,.35,1)' },
          { opacity: 1, offset: .1, easing: 'cubic-bezier(.2,.9,.35,1)' },
          { transform: `scale(1.13,1.1) rotate(${-r * .2}deg)`, opacity: 1, offset: .42, easing: 'cubic-bezier(.35,0,.25,1)' },
          { transform: 'none', opacity: 1 }], { duration: 850 });
      }, FG_START_MS + p.d * 1000);
    });
    const fgEnd = SHOW_FG ? FG_START_MS + 850 + 840 : BG_RIPPLE_MS + 700;
    if (SHOW_FG) later(() => {
      caption.style.opacity = '1';
      captionLines.forEach((line, index) => later(() => play(line, [
        { transform: 'translateY(20px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ], { duration: 1400, easing: 'cubic-bezier(.165,.84,.44,1)' }), index * 180));
    }, fgEnd - 500);

    // 3) 딜레이 후 배경 글자가 랜덤하게 서로 바뀜
    const tick = () => {
      if (my !== token) return;
      swap();
      later(tick, rnd(...SHUFFLE_EVERY));
    };
    later(tick, fgEnd + SHUFFLE_DELAY);
  }

  function swap() {
    const a = clusters[Math.floor(rnd(0, clusters.length))];
    let b; do { b = clusters[Math.floor(rnd(0, clusters.length))]; } while (b === a);
    [a, b].forEach(c => play(c.pop, [
      { transform: 'scale(1)', opacity: 1, easing: 'cubic-bezier(.4,0,.6,1)' },
      { transform: 'scale(.55)', opacity: 0, offset: .42, easing: 'cubic-bezier(.3,0,.2,1)' },
      { transform: 'scale(1.08)', opacity: 1, offset: .78, easing: 'ease-out' },
      { transform: 'scale(1)', opacity: 1 }], { duration: SWAP_MS }));
    later(() => {
      [a.slotIdx, b.slotIdx] = [b.slotIdx, a.slotIdx];
      [a, b].forEach(c => {
        const s = slots[c.slotIdx];
        c.slot.style.transform = `translate(${s.x - c.x}px,${s.y - c.y}px)`;
      });
    }, SWAP_MS * .42);
  }

  function reset() {
    token++;
    timers.forEach(clearTimeout); timers.clear();
    running.forEach(a => a.cancel()); running.clear();
    clusters.forEach(c => { HIDDEN(c.pop); c.slot.style.transform = ''; c.slotIdx = clusters.indexOf(c); });
    letters.forEach(HIDDEN);
    caption.style.opacity = '0'; caption.style.transform = '';
    captionLines.forEach(line => { line.style.opacity = '0'; line.style.transform = ''; });
    ph.forEach(p => { p.style.transform = ''; p.style.opacity = ''; });
    fx.replaceChildren();
  }

  // Scope the original document-level pointer behavior to this SVG stage.
  let active = false;
  let enabled = false;
  let isTouch = false;
  const toSvg = event => new DOMPoint(event.clientX, event.clientY)
    .matrixTransform(svg.getScreenCTM().inverse());
  function start(event) {
    if (disposed || !enabled || active) return;
    active = true;
    const point = event ? toSvg(event) : { x: 960, y: 540 };
    reveal(point.x, point.y);
  }
  const leave = () => {
    if (isTouch || !RESET_ON_LEAVE) return;
    active = false;
    reset();
  };
  const pointerDown = event => { isTouch = event.pointerType === 'touch'; };
  svg.addEventListener('pointerenter', start);
  svg.addEventListener('pointermove', start);
  svg.addEventListener('pointerleave', leave);
  svg.addEventListener('pointerdown', pointerDown);

  return {
    activate() { enabled = true; start(); },
    deactivate() { enabled = false; active = false; reset(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      reset();
      svg.removeEventListener('pointerenter', start);
      svg.removeEventListener('pointermove', start);
      svg.removeEventListener('pointerleave', leave);
      svg.removeEventListener('pointerdown', pointerDown);
      // Restore React-owned nodes before a StrictMode re-run or unmount.
      originalGroups.forEach(([group, children]) => group.replaceChildren(...children));
      originalStyles.forEach(([element, style]) => {
        if (style === null) element.removeAttribute('style');
        else element.setAttribute('style', style);
      });
    },
  };
}

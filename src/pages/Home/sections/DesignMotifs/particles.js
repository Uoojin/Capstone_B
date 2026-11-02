export const S = 138.704;
const C = S / 2;
const R = 54;
const K = 4 / 3 * Math.tan(Math.PI / 16);

// Every shape uses one move and eight cubic curves, so corresponding points
// can travel continuously between shapes without replacing the particles.
export const circle = (() => {
  const result = [C, C - R];
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 4;
    const b = a + Math.PI / 4;
    result.push(C + R * (Math.cos(a) - K * Math.sin(a)), C + R * (Math.sin(a) + K * Math.cos(a)),
      C + R * (Math.cos(b) + K * Math.sin(b)), C + R * (Math.sin(b) - K * Math.cos(b)),
      C + R * Math.cos(b), C + R * Math.sin(b));
  }
  return result;
})();
const square = [
  36, 15, 36, 15, 102, 15, 102, 15, 114, 15, 124, 25, 124, 37,
  124, 37, 124, 101, 124, 101, 124, 113, 114, 123, 102, 123,
  102, 123, 36, 123, 36, 123, 24, 123, 14, 113, 14, 101,
  14, 101, 14, 37, 14, 37, 14, 25, 24, 15, 36, 15
];
const triangle = [
  59, 20, 63, 12, 75, 12, 79, 20, 79, 20, 128, 104, 128, 104,
  133, 113, 127, 123, 117, 123, 117, 123, 21, 123, 21, 123,
  11, 123, 5, 113, 10, 104, 10, 104, 59, 20, 59, 20,
  59, 20, 59, 20, 59, 20, 59, 20, 59, 20, 59, 20
];
// This is the path of one of the six original Discovery elements.
const star = [
  134.559, 79.2439, 141.832, 82.8805, 138.882, 93.8773, 130.765, 93.3901,
  100.898, 91.6066, 72.8494, 107.806, 59.4601, 134.559,
  55.8235, 141.832, 44.8267, 138.883, 45.3139, 130.765,
  47.0974, 100.898, 30.8979, 72.8494, 4.14539, 59.4601,
  -3.12782, 55.8235, -0.178525, 44.8267, 7.93859, 45.3139,
  37.8057, 47.0974, 65.8546, 30.8979, 79.2439, 4.14539,
  82.8805, -3.12782, 93.8773, -0.178516, 93.3901, 7.9386,
  91.6066, 37.8057, 107.806, 65.8546, 134.559, 79.2439
];
const shapes = [circle, triangle, star, square];
export const pathData = values => 'M' + values[0] + ' ' + values[1] +
  Array.from({ length: 8 }, (_, i) => ' C' + values.slice(2 + i * 6, 8 + i * 6).join(' ')).join('') + ' Z';

// Fixed coordinates and animation phases keep the same particles on screen.
export const particles = Array.from({ length: 56 }, (_, i) => {
  const rand = n => { const x = Math.sin((i + 1) * n) * 43758.5453; return x - Math.floor(x) };
  return {
    x: ((i % 8) + .2 + rand(12.9898) * .6) / 8,
    y: (Math.floor(i / 8) + .2 + rand(78.233) * .6) / 7,
    phase: rand(21.41) * Math.PI * 2, speed: .65 + rand(55.17) * .55,
    rotate: Math.round(rand(67.3) * 130 - 65)
  };
});


export function createParticles(container) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = container.clientWidth, height = container.clientHeight, previous = 0;
  let current = particles.map(() => circle.slice()), morphFrame = 0, tickFrame = 0;
  const points = particles.map(p => ({ x: p.x * width, y: p.y * height, vx: 0, vy: 0 }));
  const elements = [...container.children];
  const paths = elements.map(el => el.querySelector('path'));
  function draw() { points.forEach((p, i) => { elements[i].style.transform = `translate3d(${p.x}px,${p.y}px,0)` }) }
  const observer = new ResizeObserver(() => {
    const nextWidth = container.clientWidth, nextHeight = container.clientHeight;
    if (width && height) points.forEach(p => { p.x = p.x / width * nextWidth; p.y = p.y / height * nextHeight });
    width = nextWidth; height = nextHeight; draw();
  });
  observer.observe(container);
  function tick(now) {
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    const time = now / 1000, minDistance = Math.min(125, Math.max(36, Math.min(width / 8, height / 5) * .8));
    points.forEach((p, i) => {
      const info = particles[i];
      let ax = Math.cos(time * .19 * info.speed + info.phase) * 22 + (info.x * width - p.x) * .035;
      let ay = Math.sin(time * .16 * info.speed + info.phase * 1.7) * 22 + (info.y * height - p.y) * .035;
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const dx = p.x - points[j].x, dy = p.y - points[j].y, dist = Math.max(Math.hypot(dx, dy), .1);
        if (dist < minDistance) { const force = (1 - dist / minDistance) * 160; ax += dx / dist * force; ay += dy / dist * force }
      }
      const margin = 18;
      if (p.x < margin) ax += (margin - p.x) * 1.2;
      if (p.x > width - margin) ax -= (p.x - width + margin) * 1.2;
      if (p.y < margin) ay += (margin - p.y) * 1.2;
      if (p.y > height - margin) ay -= (p.y - height + margin) * 1.2;
      const drag = Math.exp(-.85 * dt);
      p.vx = (p.vx + ax * dt) * drag; p.vy = (p.vy + ay * dt) * drag;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 45) { p.vx *= 45 / speed; p.vy *= 45 / speed }
    });
    points.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt }); draw(); tickFrame = requestAnimationFrame(tick);
  }
  draw(); if (!reduced) tickFrame = requestAnimationFrame(tick);
  function changeShapes(active, mixed) {
    cancelAnimationFrame(morphFrame);
    const start = current.map(values => values.slice());
    const ends = particles.map((_, i) => shapes[mixed ? (i * 13 + Math.floor(i / 8)) % 4 : active]);
    const startTime = performance.now();
    function animate(now) {
      const t = reduced ? 1 : Math.min((now - startTime) / 850, 1), ease = 1 - Math.pow(1 - t, 3);
      current = start.map((shape, i) => shape.map((n, j) => n + (ends[i][j] - n) * ease));
      paths.forEach((path, i) => path.setAttribute('d', pathData(current[i])));
      if (t < 1) morphFrame = requestAnimationFrame(animate);
    }
    morphFrame = requestAnimationFrame(animate);
  };
  changeShapes.dispose = () => { observer.disconnect(); cancelAnimationFrame(tickFrame); cancelAnimationFrame(morphFrame); };
  return changeShapes;
}

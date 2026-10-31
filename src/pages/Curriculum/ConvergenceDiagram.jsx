import { useState } from 'react'
import { convergenceEducation } from './curriculumData.js'

// Split each circumference at its exact intersections with the other circles.
// Only arcs whose midpoint lies inside another circle receive a dash pattern.
function circleOutlineArcs(circle) {
  const radius = 145
  const tau = Math.PI * 2
  const angles = [0, tau]
  for (const other of convergenceEducation) {
    if (other.id === circle.id) continue
    const dx = other.cx - circle.cx
    const dy = other.cy - circle.cy
    const distance = Math.hypot(dx, dy)
    if (!distance || distance >= radius * 2) continue
    const direction = Math.atan2(dy, dx)
    const spread = Math.acos(distance / (radius * 2))
    for (const angle of [direction - spread, direction + spread]) angles.push((angle + tau) % tau)
  }
  angles.sort((a, b) => a - b)
  const arcs = []
  for (let i = 0; i < angles.length - 1; i++) {
    const start = angles[i], end = angles[i + 1]
    if (end - start < 1e-8) continue
    const middle = (start + end) / 2
    const x = circle.cx + radius * Math.cos(middle)
    const y = circle.cy + radius * Math.sin(middle)
    const dashed = convergenceEducation.some((other) => other.id !== circle.id && Math.hypot(x - other.cx, y - other.cy) < radius)
    const previous = arcs[arcs.length - 1]
    if (previous && previous.dashed === dashed) previous.end = end
    else arcs.push({ start, end, dashed })
  }
  if (arcs.length > 1 && arcs[0].dashed === arcs[arcs.length - 1].dashed) {
    arcs[arcs.length - 1].end = arcs.shift().end + tau
  }
  return arcs.map(({ start, end, dashed }) => ({
    dashed,
    path: `M ${circle.cx + radius * Math.cos(start)} ${circle.cy + radius * Math.sin(start)} A ${radius} ${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${circle.cx + radius * Math.cos(end)} ${circle.cy + radius * Math.sin(end)}`,
  }))
}

export default function ConvergenceDiagram() {
  const [activeId, setActiveId] = useState(null)
  // Paint the active circle last, including its overlap with the other circles.
  const circles = [...convergenceEducation].sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId))
  return (
    <svg className="curriculum-diagram" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-labelledby="convergence-description" onPointerLeave={() => setActiveId(null)}>
      <title id="convergence-description">DESIGN, MEDIA, TECHNOLOGY의 융합 교육</title>
      <g className="curriculum-diagram-orbit" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <circle cx="300" cy="300" r="285" strokeDasharray="2 4" />
        {[210, 330, 90].map((angle) => (
          <g key={angle} transform={`translate(${300 + 285 * Math.cos(angle * Math.PI / 180)} ${300 + 285 * Math.sin(angle * Math.PI / 180)}) rotate(${angle + 90})`}>
            <path d="M -7 -5 L 0 0 L -7 5" />
          </g>
        ))}
      </g>
      {circles.map(({ id, label, cx, cy, heading, description }) => {
        const active = id === activeId
        const top = cy - (heading.length * 26 + description.length * 23 + 12 - 23) / 2
        return (
          <g key={id} className={`curriculum-diagram-circle${active ? ' is-active' : ''}`} role="button" tabIndex={0} aria-label={`${label}: ${[...heading, ...description].join(', ')}`} aria-pressed={active}
            onPointerEnter={() => setActiveId(id)} onPointerLeave={() => setActiveId((current) => current === id ? null : current)}
            onFocus={() => setActiveId(id)} onBlur={() => setActiveId((current) => current === id ? null : current)}
            onClick={() => setActiveId(id)} onKeyDown={(event) => { if (event.key === 'Escape') setActiveId(null) }}>
            <circle cx={cx} cy={cy} r="145" />
            <g className="curriculum-diagram-outline" aria-hidden="true">
              {circleOutlineArcs({ id, cx, cy }).map((arc, index) => <path key={index} d={arc.path} strokeDasharray={arc.dashed ? '3 3' : undefined} />)}
            </g>
            <text className="curriculum-diagram-label" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">{label}</text>
            <text className="curriculum-diagram-detail" textAnchor="middle" dominantBaseline="middle">
              {heading.map((line, index) => <tspan className="curriculum-diagram-detail-heading" key={line} x={cx} y={top + index * 26}>{line}</tspan>)}
              {description.map((line, index) => <tspan key={line} x={cx} y={top + heading.length * 26 + 12 + index * 23}>{line}</tspan>)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}


import React, { useMemo, useRef, useState } from 'react'
import { applyParamsToGraph } from './deeMath'

const COLORS = {
  person: '#2E7D32',
  artifact: '#1565C0',
  event: '#6A1B9A',
}

function layoutCircle(nodes, width, height) {
  const n = nodes.length || 1
  const cx = width / 2
  const cy = height / 2
  const R = Math.max(80, Math.min(cx, cy) - 40)
  return nodes.map((node, i) => {
    const angle = (i / n) * 2 * Math.PI
    return { ...node, x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) }
  })
}

export default function GraphViewSVG({ graph, onSelectNode, params }) {
  const wrapperRef = useRef(null)
  const [viewport, setViewport] = useState({ scale: 1, tx: 0, ty: 0 })

  const derived = useMemo(() => applyParamsToGraph(graph, params), [graph, params])
  const width = 1200
  const height = 600
  const nodes = useMemo(() => layoutCircle(derived.nodes || [], width, height), [derived.nodes])
  const idToPos = useMemo(() => {
    const m = new Map()
    nodes.forEach((n) => m.set(n.id || n.data?.id, n))
    return m
  }, [nodes])
  const edges = (derived.edges || []).map((e) => ({ ...e }))

  function onWheel(e) {
    e.preventDefault()
    const delta = -e.deltaY
    const factor = delta > 0 ? 1.1 : 0.9
    setViewport((v) => ({ ...v, scale: Math.max(0.4, Math.min(4, v.scale * factor)) }))
  }

  const drag = useRef(null)
  function onMouseDown(e) {
    drag.current = { x: e.clientX, y: e.clientY, start: { ...viewport } }
  }
  function onMouseMove(e) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    setViewport({ ...drag.current.start, tx: drag.current.start.tx + dx, ty: drag.current.start.ty + dy })
  }
  function onMouseUp() { drag.current = null }

  const transform = `translate(${viewport.tx} ${viewport.ty}) scale(${viewport.scale})`

  return (
    <div ref={wrapperRef} className="graph-container" onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <svg className="graph-surface" viewBox={`0 0 ${width} ${height}`}>
        <g transform={transform}>
          {edges.map((e, i) => {
            const s = idToPos.get(e.source)
            const t = idToPos.get(e.target)
            if (!s || !t) return null
            const w = Math.max(1, (e.weight || 1) * 2)
            return (
              <line key={e.id || `e${i}`} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#9E9E9E" strokeWidth={w} opacity="0.8" />
            )
          })}
          {nodes.map((n) => {
            const data = n.data || n
            const r = 10 + 4 * Math.cbrt((data.sizeValue || (data.MB || 0) + (data.MF || 0) || 1))
            const opacity = Math.max(0.25, data.mf_decay ?? 1)
            const fill = COLORS[data.type] || '#607D8B'
            const id = data.id || n.id
            return (
              <g key={id} tabIndex={0} onClick={() => onSelectNode?.(data)}>
                <circle cx={n.x} cy={n.y} r={r} fill={fill} stroke="#222" strokeWidth="2" opacity={opacity} />
                <text x={n.x} y={n.y + r + 12} textAnchor="middle" fontSize="10" fill="#222">{(data.labels && data.labels[0]) || id}</text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

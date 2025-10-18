import React, { useEffect, useMemo, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'
import debounce from 'lodash.debounce'
import { applyParamsToGraph } from './deeMath'

cytoscape.use(fcose)

const COLORS = {
  person: '#2E7D32',
  artifact: '#1565C0',
  event: '#6A1B9A',
}

function toElements(graph) {
  const nodes = (graph.nodes || []).map((n) => ({ data: { id: n.id, ...n } }))
  const edges = (graph.edges || []).map((e, idx) => ({ data: { id: e.id || `e${idx}` , ...e } }))
  return [...nodes, ...edges]
}

export default function GraphView({ graph, onSelectNode, params }) {
  const containerRef = useRef(null)
  const cyRef = useRef(null)
  const [ready, setReady] = useState(false)

  const derivedGraph = useMemo(() => applyParamsToGraph(graph, params), [graph, params])

  const elements = useMemo(() => toElements(derivedGraph), [derivedGraph])

  useEffect(() => {
    if (!containerRef.current) return
    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele) => COLORS[ele.data('type')] || '#607D8B',
            'label': (ele) => (ele.data('labels')?.[0] || ele.id()),
            'font-size': 10,
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#222',
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'border-width': (ele) => 2,
            'border-color': '#222',
            'opacity': (ele) => Math.max(0.25, ele.data('mf_decay') ?? 1),
            'width': (ele) => 20 + 10 * Math.cbrt(ele.data('sizeValue') || 1),
            'height': (ele) => 20 + 10 * Math.cbrt(ele.data('sizeValue') || 1),
          },
        },
        {
          selector: 'edge',
          style: {
            'width': (ele) => Math.max(1, (ele.data('weight') || 1) * 2),
            'line-color': '#9E9E9E',
            'target-arrow-color': '#9E9E9E',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'opacity': 0.8,
          },
        },
        { selector: '.hidden', style: { 'display': 'none' } },
        { selector: ':selected', style: { 'border-color': '#FF6F00', 'border-width': 3 } },
      ],
      layout: { name: 'fcose', animate: false, fit: true, padding: 20 },
    })
    cyRef.current = cy
    setReady(true)
    const onTap = (evt) => {
      if (evt.target && evt.target.data && evt.target.data().id && evt.target.group && evt.target.group() === 'nodes') {
        onSelectNode?.(evt.target.data())
      }
    }
    cy.on('tap', 'node', onTap)
    return () => {
      cy.off('tap', 'node', onTap)
      cy.destroy()
      cyRef.current = null
    }
  }, [])

  // Update elements/styles efficiently
  useEffect(() => {
    const cy = cyRef.current
    if (!cy || !ready) return
    cy.batch(() => {
      cy.elements().remove()
      cy.add(elements)
    })
    // debounce layout to keep frames under budget
    debounce(() => cy.layout({ name: 'fcose', animate: false }).run(), 75)()
  }, [elements, ready])

  return (
    <div className="graph-container">
      <div ref={containerRef} className="graph-surface" />
    </div>
  )
}

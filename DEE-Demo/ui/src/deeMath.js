// Client-side simulation helpers for quick what-if demos.
// These do NOT affect backend state; purely visual recalculation.

export function applyParamsToGraph(graph, params) {
  const safeGraph = graph || { nodes: [], edges: [], meta: {} }
  const { alpha = 0.6, beta = 0.6, tauWeeks = 7 } = params || {}
  const tauMs = tauWeeks * 7 * 24 * 60 * 60 * 1000
  const now = Date.now()

  const nodes = (safeGraph.nodes ?? []).map((n) => {
    const type = n.type || n.data?.type
    const data = n.data || n
    const created = data.createdAt ? new Date(data.createdAt).getTime() : now
    const age = Math.max(0, now - created)
    const halfLives = tauMs > 0 ? age / tauMs : 0
    const decay = Math.pow(0.5, halfLives) // MF decays with half-life tau

    const I = (data.impact?.I ?? data.I) ?? 0
    // If MB/MF are provided by backend, respect them (apply only decay to MF if desired);
    // else split from I and alpha.
    const MB = typeof data.MB === 'number' ? data.MB : I * alpha
    const MF0 = typeof data.MF === 'number' ? data.MF : I * (1 - alpha)
    const MF = MF0 * decay

    return {
      ...n,
      data: {
        ...(n.data || n),
        MB,
        MF,
        mf_decay: decay,
        sizeValue: MB + MF,
      },
    }
  })

  return { ...safeGraph, nodes }
}

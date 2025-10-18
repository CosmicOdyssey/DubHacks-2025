import { invoke } from '@forge/bridge'

export async function fetchGraph(epoch) {
  const res = await invoke('main-resolver', { path: '/graph', epoch })
  return res?.body ?? res
}

export async function fetchNodeFeed(id) {
  const res = await invoke('main-resolver', { path: `/node/${id}/feed` })
  return res?.body ?? res
}

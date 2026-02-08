import { rawgFetch } from "./rawgClient.js"

export async function listarJuegosRawg({ page = 1, pageSize = 20, ordering = "-added", signal } = {}) {
  return await rawgFetch("/games", {
    signal,
    params: {
      page,
      page_size: pageSize,
      ordering,
    },
  })
}

export async function buscarJuegosRawg({ query, page = 1, pageSize = 12, signal } = {}) {
  return await rawgFetch("/games", {
    signal,
    params: {
      search: query,
      page,
      page_size: pageSize,
    },
  })
}

export async function obtenerJuegoRawgPorId({ juegoId, signal } = {}) {
  if (!juegoId) throw new Error("Falta juegoId para consultar RAWG.")
  return await rawgFetch(`/games/${juegoId}`, { signal })
}


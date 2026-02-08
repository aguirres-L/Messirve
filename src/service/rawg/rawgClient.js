const RAWG_BASE_URL = "https://api.rawg.io/api"

function obtenerApiKey() {
  return import.meta.env?.VITE_RAWG_API_KEY || ""
}

function construirUrl(endpoint, params = {}) {
  const url = new URL(`${RAWG_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return
    url.searchParams.set(k, String(v))
  })
  return url
}

export async function rawgFetch(endpoint, { params, signal } = {}) {
  const apiKey = obtenerApiKey()
  if (!apiKey) {
    throw new Error(
      "Falta configurar VITE_RAWG_API_KEY. Creá un .env.local en la raíz del proyecto y agregá tu API key."
    )
  }

  const url = construirUrl(endpoint, { ...params, key: apiKey })
  const response = await fetch(url, { signal })

  if (!response.ok) {
    let detalle = ""
    try {
      const data = await response.json()
      detalle = data?.detail ? ` (${data.detail})` : ""
    } catch {
      // ignore
    }
    throw new Error(`RAWG API error: ${response.status} ${response.statusText}${detalle}`)
  }

  return await response.json()
}


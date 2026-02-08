import { useEffect, useMemo, useState } from "react"
import { buscarJuegosRawg } from "../../../../service/rawg/index.js"

export function useRawgSearch() {
  const [termino, setTermino] = useState("elden ring")
  const [resultados, setResultados] = useState([])
  const [isCargando, setIsCargando] = useState(false)
  const [error, setError] = useState("")

  const terminoLimpio = useMemo(() => termino.trim(), [termino])

  useEffect(() => {
    if (!terminoLimpio) {
      setResultados([])
      setError("")
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        setIsCargando(true)
        setError("")
        const data = await buscarJuegosRawg({ query: terminoLimpio, pageSize: 12, signal: controller.signal })
        setResultados(data?.results ?? [])
      } catch (e) {
        if (controller.signal.aborted) return
        setError(e?.message || "No se pudo consultar RAWG.")
      } finally {
        if (!controller.signal.aborted) setIsCargando(false)
      }
    }, 450)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [terminoLimpio])

  return {
    termino,
    setTermino,
    resultados,
    isCargando,
    error,
  }
}


import { useEffect, useMemo, useRef, useState } from "react"
import {
  clamp01,
  crearJugadores11v11,
  crearPlanDemo,
  sampleKeyframes,
} from "./utils/tableOfDTUtils"

const crearJugadaInicial = () => ({
  id: "jugada-1",
  nombre: "Salida + Progresión",
})

/**
 * Hook principal del tablero: estado + motor de reproducción.
 *
 * Decisiones (por qué):
 * - Modelamos jugadas como “plan” (tracks por keyframes) porque escala:
 *   luego podés editar keyframes, agregar pausas, pases, y ramas (cortar/seguir).
 * - La IA rival por ahora es heurística (simple), pero enchufable a futuro.
 */
export function useTableOfDT() {
  const refTablero = useRef(null)

  const [jugadaActiva, setJugadaActiva] = useState(() => crearJugadaInicial())
  const [jugadoresBase, setJugadoresBase] = useState(() => crearJugadores11v11())

  const [jugadorSeleccionadoId, setJugadorSeleccionadoId] = useState("l-8")
  const [jugadorArrastrandoId, setJugadorArrastrandoId] = useState(null)

  const [config, setConfig] = useState(() => ({
    equipoPropio: "local",
    modoReaccion: "continuar", // "continuar" | "cortar"
    modoPostCorte: "pases", // "pases" | "contraataque"
  }))

  const plan = useMemo(() => crearPlanDemo(jugadoresBase, config), [jugadoresBase, config])

  const [isReproduciendo, setIsReproduciendo] = useState(false)
  const [progresoAnimacion, setProgresoAnimacion] = useState(0)

  // Posiciones “en vivo” (solo durante reproducción). En modo editor, se usa `jugadoresBase`.
  const [posicionesPlayback, setPosicionesPlayback] = useState(null)
  const [ballPosPlayback, setBallPosPlayback] = useState(null)

  const jugadores = useMemo(() => {
    if (!posicionesPlayback) return jugadoresBase
    return jugadoresBase.map((j) => {
      const p = posicionesPlayback[j.id]
      return p ? { ...j, x: p.x, y: p.y } : j
    })
  }, [jugadoresBase, posicionesPlayback])

  const ballPos = useMemo(() => {
    if (ballPosPlayback) return ballPosPlayback
    const b0 = sampleKeyframes(plan.ball, 0)
    return { x: b0.x, y: b0.y }
  }, [ballPosPlayback, plan.ball])

  const jugadorSeleccionado = useMemo(
    () => jugadores.find((j) => j.id === jugadorSeleccionadoId) ?? null,
    [jugadores, jugadorSeleccionadoId]
  )

  const toPosRelativa = (event) => {
    const nodo = refTablero.current
    if (!nodo) return { x: 0.5, y: 0.5 }

    const rect = nodo.getBoundingClientRect()
    const x = clamp01((event.clientX - rect.left) / rect.width)
    const y = clamp01((event.clientY - rect.top) / rect.height)
    return { x, y }
  }

  const onPointerDownJugador = (event, jugadorId) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setJugadorSeleccionadoId(jugadorId)
    if (!isReproduciendo) setJugadorArrastrandoId(jugadorId)
  }

  // Drag: edita posiciones base (modo editor). Si estás reproduciendo, por ahora no permitimos.
  useEffect(() => {
    if (!jugadorArrastrandoId) return
    if (isReproduciendo) return

    const onMove = (event) => {
      const pos = toPosRelativa(event)
      setJugadoresBase((prev) =>
        prev.map((j) => (j.id === jugadorArrastrandoId ? { ...j, x: pos.x, y: pos.y } : j))
      )
    }

    const onUp = () => setJugadorArrastrandoId(null)

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp, { once: true })

    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [jugadorArrastrandoId, isReproduciendo])

  // Reproducción: sampleamos el plan y actualizamos jugadores + balón.
  useEffect(() => {
    if (!isReproduciendo) return

    const inicio = performance.now()
    let raf = 0

    const tick = (ahora) => {
      const t = clamp01((ahora - inicio) / plan.duracionMs)
      setProgresoAnimacion(t)

      setPosicionesPlayback(() => {
        /** @type {Record<string, {x:number,y:number}>} */
        const siguiente = {}
        for (const j of jugadoresBase) {
          const track = plan.tracks[j.id]
          if (!track) continue
          const pos = sampleKeyframes(track, t)
          siguiente[j.id] = { x: pos.x, y: pos.y }
        }
        return siguiente
      })

      const b = sampleKeyframes(plan.ball, t)
      setBallPosPlayback({ x: b.x, y: b.y })

      if (t >= 1) {
        setIsReproduciendo(false)
        setPosicionesPlayback(null)
        setBallPosPlayback(null)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isReproduciendo, plan, jugadoresBase])

  const resetear = () => {
    setIsReproduciendo(false)
    setProgresoAnimacion(0)
    setJugadoresBase(crearJugadores11v11())
    setJugadorSeleccionadoId("l-8")
    setJugadorArrastrandoId(null)
    setPosicionesPlayback(null)
    setBallPosPlayback(null)
  }

  const alternarPlay = () => {
    if (isReproduciendo) {
      setIsReproduciendo(false)
      setPosicionesPlayback(null)
      setBallPosPlayback(null)
      return
    }
    setProgresoAnimacion(0)
    setJugadorArrastrandoId(null)
    setIsReproduciendo(true)
  }

  return {
    refTablero,
    jugadaActiva,
    setJugadaActiva,
    jugadores,
    jugadoresBase,
    setJugadoresBase,
    jugadorSeleccionadoId,
    setJugadorSeleccionadoId,
    jugadorSeleccionado,
    jugadorArrastrandoId,
    onPointerDownJugador,
    isReproduciendo,
    progresoAnimacion,
    alternarPlay,
    resetear,
    config,
    setConfig,
    plan,
    ballPos,
  }
}


/**
 * Utils del tablero táctico (web).
 * Nota: el proyecto está en React + Vite con `.jsx`; por eso uso JS + JSDoc
 * (tipado “liviano”) en vez de TS, para no forzar configuración extra hoy.
 */

/**
 * @typedef {"local"|"visita"} Equipo
 */

/**
 * @typedef {{x:number, y:number}} Punto
 */

/**
 * @typedef {{t:number, x:number, y:number}} Keyframe
 */

/**
 * @typedef {{
 *  id: string,
 *  nombre: string,
 *  numero: number,
 *  equipo: Equipo,
 *  x: number,
 *  y: number
 * }} Jugador
 */

export const clamp01 = (valor) => Math.max(0, Math.min(1, valor))
export const lerp = (a, b, t) => a + (b - a) * t

export const distancia2 = (a, b) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

/**
 * @param {Keyframe[]} keyframes
 * @param {number} t 0..1
 * @returns {Punto}
 */
export function sampleKeyframes(keyframes, t) {
  if (!keyframes?.length) return { x: 0.5, y: 0.5 }
  if (keyframes.length === 1) return { x: keyframes[0].x, y: keyframes[0].y }

  const tt = clamp01(t)
  const ultimo = keyframes[keyframes.length - 1]
  if (tt >= ultimo.t) return { x: ultimo.x, y: ultimo.y }

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (tt >= a.t && tt <= b.t) {
      const denom = b.t - a.t || 1
      const localT = clamp01((tt - a.t) / denom)
      return { x: lerp(a.x, b.x, localT), y: lerp(a.y, b.y, localT) }
    }
  }

  const primero = keyframes[0]
  return { x: primero.x, y: primero.y }
}

/**
 * Crea 11v11 (4-3-3 vs 4-4-2 “genérico”) en coordenadas normalizadas.
 * x=0 es arco local (izquierda), x=1 arco visita (derecha).
 * @returns {Jugador[]}
 */
export function crearJugadores11v11() {
  /** @type {Jugador[]} */
  const locales = [
    { id: "l-1", nombre: "GK", numero: 1, equipo: "local", x: 0.08, y: 0.5 },
    { id: "l-2", nombre: "RB", numero: 2, equipo: "local", x: 0.20, y: 0.20 },
    { id: "l-3", nombre: "RCB", numero: 3, equipo: "local", x: 0.20, y: 0.40 },
    { id: "l-4", nombre: "LCB", numero: 4, equipo: "local", x: 0.20, y: 0.60 },
    { id: "l-5", nombre: "LB", numero: 5, equipo: "local", x: 0.20, y: 0.80 },
    { id: "l-6", nombre: "DM", numero: 6, equipo: "local", x: 0.34, y: 0.50 },
    { id: "l-7", nombre: "CM", numero: 8, equipo: "local", x: 0.45, y: 0.35 },
    { id: "l-8", nombre: "AM", numero: 10, equipo: "local", x: 0.56, y: 0.50 },
    { id: "l-9", nombre: "RW", numero: 7, equipo: "local", x: 0.64, y: 0.24 },
    { id: "l-10", nombre: "LW", numero: 11, equipo: "local", x: 0.64, y: 0.76 },
    { id: "l-11", nombre: "ST", numero: 9, equipo: "local", x: 0.76, y: 0.50 },
  ]

  /** @type {Jugador[]} */
  const visitas = [
    { id: "v-1", nombre: "GK", numero: 1, equipo: "visita", x: 0.92, y: 0.5 },
    { id: "v-2", nombre: "LB", numero: 3, equipo: "visita", x: 0.80, y: 0.20 },
    { id: "v-3", nombre: "LCB", numero: 4, equipo: "visita", x: 0.80, y: 0.40 },
    { id: "v-4", nombre: "RCB", numero: 5, equipo: "visita", x: 0.80, y: 0.60 },
    { id: "v-5", nombre: "RB", numero: 2, equipo: "visita", x: 0.80, y: 0.80 },
    { id: "v-6", nombre: "LM", numero: 11, equipo: "visita", x: 0.66, y: 0.22 },
    { id: "v-7", nombre: "CM", numero: 6, equipo: "visita", x: 0.62, y: 0.42 },
    { id: "v-8", nombre: "CM", numero: 8, equipo: "visita", x: 0.62, y: 0.58 },
    { id: "v-9", nombre: "RM", numero: 7, equipo: "visita", x: 0.66, y: 0.78 },
    { id: "v-10", nombre: "ST", numero: 9, equipo: "visita", x: 0.54, y: 0.46 },
    { id: "v-11", nombre: "ST", numero: 10, equipo: "visita", x: 0.54, y: 0.54 },
  ]

  return [...locales, ...visitas]
}

/**
 * @typedef {"continuar"|"cortar"} ModoReaccion
 * @typedef {"pases"|"contraataque"} ModoPostCorte
 */

/**
 * @typedef {{
 *  duracionMs: number,
 *  tracks: Record<string, Keyframe[]>,
 *  ball: Keyframe[],
 *  rutasPreview: Record<string, Punto[]>,
 *  meta: { fase: "normal"|"corte"|"postCorte", corteEnT?: number }
 * }} PlanJugada
 */

const keyframe = (t, p) => ({ t, x: p.x, y: p.y })

/**
 * Genera un plan demo: tu equipo mueve varios jugadores y el balón “pasa”.
 * Si reacción = "cortar", se provoca corte y se encadena "pases" o "contraataque".
 *
 * @param {Jugador[]} jugadores
 * @param {{
 *  equipoPropio: Equipo,
 *  modoReaccion: ModoReaccion,
 *  modoPostCorte: ModoPostCorte,
 * }} config
 * @returns {PlanJugada}
 */
export function crearPlanDemo(jugadores, config) {
  const { equipoPropio, modoReaccion, modoPostCorte } = config

  const byId = Object.fromEntries(jugadores.map((j) => [j.id, j]))
  const propio = jugadores.filter((j) => j.equipo === equipoPropio)
  const rival = jugadores.filter((j) => j.equipo !== equipoPropio)

  // “Conductores” del flujo (mínimo viable para modelar pases)
  const idDM = equipoPropio === "local" ? "l-6" : "v-7"
  const idCM = equipoPropio === "local" ? "l-7" : "v-8"
  const idAM = equipoPropio === "local" ? "l-8" : "v-10"
  const idW = equipoPropio === "local" ? "l-9" : "v-6"
  const idST = equipoPropio === "local" ? "l-11" : "v-11"

  const pDM = byId[idDM]
  const pCM = byId[idCM]
  const pAM = byId[idAM]
  const pW = byId[idW]
  const pST = byId[idST]

  // Si por algún motivo faltan IDs (edición futura), caemos a lo primero disponible.
  const fallback = (j) => j ?? propio[0]

  const a = { x: fallback(pDM).x, y: fallback(pDM).y }
  const b = { x: fallback(pCM).x, y: fallback(pCM).y }
  const c = { x: fallback(pAM).x, y: fallback(pAM).y }
  const d = { x: fallback(pW).x, y: fallback(pW).y }
  const e = { x: fallback(pST).x, y: fallback(pST).y }

  /** @type {Record<string, Keyframe[]>} */
  const tracks = {}

  // Tu equipo se mueve (desmarques / apoyo). Esto es intencionalmente simple.
  const mover = (id, kfs) => {
    if (!byId[id]) return
    tracks[id] = kfs
  }

  const duracionMs = modoReaccion === "cortar" ? 3600 : 3200
  const tCorte = 0.58

  mover(idDM, [keyframe(0, a), keyframe(0.55, { x: a.x + 0.03, y: a.y - 0.02 }), keyframe(1, { x: a.x + 0.02, y: a.y })])
  mover(idCM, [keyframe(0, b), keyframe(0.55, { x: b.x + 0.06, y: b.y + 0.02 }), keyframe(1, { x: b.x + 0.05, y: b.y })])
  mover(idAM, [keyframe(0, c), keyframe(0.55, { x: c.x + 0.08, y: c.y - 0.06 }), keyframe(1, { x: c.x + 0.10, y: c.y - 0.02 })])
  mover(idW, [keyframe(0, d), keyframe(0.55, { x: d.x + 0.07, y: d.y + 0.04 }), keyframe(1, { x: d.x + 0.08, y: d.y + 0.02 })])
  mover(idST, [keyframe(0, e), keyframe(0.55, { x: e.x + 0.05, y: e.y - 0.02 }), keyframe(1, { x: e.x + 0.06, y: e.y })])

  // “Basculación” rival base (si continuar) o presión + intercept (si cortar)
  const carrierEnNormal = { x: d.x, y: d.y }
  const carrierEnFinal = { x: d.x + 0.08, y: d.y + 0.02 }

  // El rival más cercano al punto de corte
  const puntoCorte = { x: lerp(c.x, d.x, 0.65), y: lerp(c.y, d.y, 0.65) }
  const interceptor = rival
    .slice()
    .sort((j1, j2) => distancia2({ x: j1.x, y: j1.y }, puntoCorte) - distancia2({ x: j2.x, y: j2.y }, puntoCorte))[0]

  const presionarHacia = (id, objetivo, intensidad) => {
    const base = byId[id]
    if (!base) return
    const fin = {
      x: lerp(base.x, objetivo.x, intensidad),
      y: lerp(base.y, objetivo.y, intensidad),
    }
    tracks[id] = [keyframe(0, { x: base.x, y: base.y }), keyframe(0.6, fin), keyframe(1, fin)]
  }

  if (modoReaccion === "continuar") {
    // 4-5 rivales presionan el lado del balón
    rival.slice(0, 5).forEach((j, idx) => presionarHacia(j.id, idx < 3 ? carrierEnNormal : carrierEnFinal, 0.20))
  } else {
    // Corte: un interceptor va al punto, otros presionan.
    if (interceptor?.id) {
      tracks[interceptor.id] = [
        keyframe(0, { x: interceptor.x, y: interceptor.y }),
        keyframe(tCorte, puntoCorte),
        keyframe(1, modoPostCorte === "contraataque" ? { x: puntoCorte.x - 0.18, y: puntoCorte.y } : puntoCorte),
      ]
    }
    rival
      .filter((j) => j.id !== interceptor?.id)
      .slice(0, 4)
      .forEach((j) => presionarHacia(j.id, puntoCorte, 0.18))
  }

  // Balón: pase DM -> CM -> AM -> W, y luego:
  // - continuar: W -> ST (final)
  // - cortar: se corta cerca de W; post-corte: 1-2 pases o contraataque
  /** @type {Keyframe[]} */
  let ball = [
    keyframe(0, a),
    keyframe(0.22, b),
    keyframe(0.44, c),
    keyframe(0.58, d),
  ]

  if (modoReaccion === "continuar") {
    ball = [...ball, keyframe(0.84, e), keyframe(1, e)]
  } else {
    const posInterceptor = interceptor ? { x: interceptor.x, y: interceptor.y } : puntoCorte
    ball = [...ball, keyframe(tCorte, puntoCorte), keyframe(tCorte + 0.04, puntoCorte)]

    if (modoPostCorte === "pases") {
      const rivalesCerca = rival
        .slice()
        .sort((j1, j2) => distancia2({ x: j1.x, y: j1.y }, puntoCorte) - distancia2({ x: j2.x, y: j2.y }, puntoCorte))
      const r1 = rivalesCerca[0]
      const r2 = rivalesCerca[1] ?? r1
      const r3 = rivalesCerca[2] ?? r2

      ball = [
        ...ball,
        keyframe(tCorte + 0.08, { x: posInterceptor.x, y: posInterceptor.y }),
        keyframe(0.76, { x: r2.x, y: r2.y }),
        keyframe(0.90, { x: r3.x, y: r3.y }),
        keyframe(1, { x: r3.x, y: r3.y }),
      ]
    } else {
      // Contraataque: el balón progresa hacia el arco del equipo propio.
      const arcoPropio = equipoPropio === "local" ? { x: 0.08, y: 0.5 } : { x: 0.92, y: 0.5 }
      const destino = equipoPropio === "local"
        ? { x: 0.18, y: clamp01(puntoCorte.y + 0.05) }
        : { x: 0.82, y: clamp01(puntoCorte.y - 0.05) }

      ball = [
        ...ball,
        keyframe(tCorte + 0.07, { x: posInterceptor.x, y: posInterceptor.y }),
        keyframe(0.82, destino),
        keyframe(1, arcoPropio),
      ]

      // Defensa: tus jugadores “repliegan” (los más adelantados).
      propio
        .slice()
        .sort((j1, j2) => j2.x - j1.x)
        .slice(0, 5)
        .forEach((j) => {
          const base = byId[j.id]
          const fin =
            equipoPropio === "local"
              ? { x: clamp01(base.x - 0.16), y: base.y }
              : { x: clamp01(base.x + 0.16), y: base.y }
          tracks[j.id] = tracks[j.id] ?? [keyframe(0, { x: base.x, y: base.y }), keyframe(1, fin)]
        })
    }
  }

  // Rutas preview (para dibujar “trail” mágico: solo de actores principales)
  const rutasPreview = {
    [idDM]: [a, { x: a.x + 0.03, y: a.y - 0.02 }, { x: a.x + 0.02, y: a.y }],
    [idCM]: [b, { x: b.x + 0.06, y: b.y + 0.02 }, { x: b.x + 0.05, y: b.y }],
    [idAM]: [c, { x: c.x + 0.08, y: c.y - 0.06 }, { x: c.x + 0.10, y: c.y - 0.02 }],
    [idW]: [d, { x: d.x + 0.07, y: d.y + 0.04 }, { x: d.x + 0.08, y: d.y + 0.02 }],
  }

  return {
    duracionMs,
    tracks,
    ball,
    rutasPreview,
    meta: { fase: modoReaccion === "cortar" ? "corte" : "normal", corteEnT: modoReaccion === "cortar" ? tCorte : undefined },
  }
}

/**
 * Convierte una ruta de puntos a un `d` de SVG (viewBox 0..100).
 * @param {Punto[]} puntos
 */
export function pathToD(puntos) {
  if (!puntos?.length) return ""
  const [primero, ...resto] = puntos
  return ["M", primero.x * 100, primero.y * 100, ...resto.flatMap((p) => ["L", p.x * 100, p.y * 100])].join(" ")
}


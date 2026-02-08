import { useMemo } from "react"
import TabletNavbarComponent from "./components_tablet/TabletNavbar"
import { pathToD } from "./utils/tableOfDTUtils"
import { useTableOfDT } from "./useTableOfDT"



function PlayerToken({ jugador, isSeleccionado, onPointerDown }) {
  const clasesEquipo =
    jugador.equipo === "local"
      ? "bg-emerald-400 text-slate-950 ring-emerald-300/60"
      : "bg-sky-200 text-slate-950 ring-sky-200/60"

  return (
    <button
      type="button"
      className={[
        "group absolute -translate-x-1/2 -translate-y-1/2 select-none rounded-full px-2.5 py-2 text-xs font-extrabold shadow-lg ring-1",
        "focus:outline-none focus:ring-2 focus:ring-white/70",
        clasesEquipo,
        isSeleccionado ? "ring-2 ring-white/70" : "ring-white/10",
      ].join(" ")}
      style={{ left: `${jugador.x * 100}%`, top: `${jugador.y * 100}%` }}
      onPointerDown={(e) => onPointerDown(e, jugador.id)}
      aria-label={`Jugador ${jugador.numero} ${jugador.nombre}`}
    >
      <span className="tabular-nums">{jugador.numero}</span>
      <span className="sr-only">{jugador.nombre}</span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/90 px-2 py-1 text-[10px] font-semibold text-white/80 shadow-xl group-hover:block">
        {jugador.nombre}
      </span>
    </button>
  )
}

function BallToken({ ballPos }) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_20px_rgba(34,211,238,0.35)] ring-1 ring-white/20"
      style={{ left: `${ballPos.x * 100}%`, top: `${ballPos.y * 100}%`, width: 10, height: 10 }}
      aria-hidden="true"
    />
  )
}

function PitchLayer({ rutas, progresoAnimacion, isReproduciendo }) {
  const dPaths = useMemo(() => {
    const entradas = Object.entries(rutas ?? {})
    return entradas.map(([id, puntos]) => ({ id, d: pathToD(puntos) })).filter((it) => it.d)
  }, [rutas])

  const dash = 240
  const offset = dash - dash * Math.max(0, Math.min(1, progresoAnimacion))

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Líneas base de cancha */}
      <rect x="4" y="4" width="92" height="92" rx="6" fill="none" stroke="rgba(255,255,255,0.12)" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(255,255,255,0.10)" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.10)" />
      <circle cx="50" cy="50" r="1.2" fill="rgba(255,255,255,0.14)" />
      <rect x="4" y="28" width="10" height="44" rx="2" fill="none" stroke="rgba(255,255,255,0.10)" />
      <rect x="86" y="28" width="10" height="44" rx="2" fill="none" stroke="rgba(255,255,255,0.10)" />

      {/* Rutas “mágicas” */}
      {dPaths.length ? (
        <g>
          <defs>
            <linearGradient id="rutaMagica" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.0)" />
              <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.9" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {dPaths.map((p) => (
            <path key={`${p.id}-glow`} d={p.d} fill="none" stroke="url(#rutaMagica)" strokeWidth="1.2" filter="url(#glow)" opacity="0.8" />
          ))}

          {isReproduciendo
            ? dPaths.map((p) => (
                <path
                  key={`${p.id}-dash`}
                  d={p.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="0.45"
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  opacity="0.9"
                />
              ))
            : null}
        </g>
      ) : null}
    </svg>
  )
}

export default function Tablet_of_DT_Component() {
  // Este componente no recibe props
  const {
    refTablero,
    jugadaActiva,
    jugadores,
    jugadorSeleccionadoId,
    jugadorSeleccionado,
    onPointerDownJugador,
    isReproduciendo,
    progresoAnimacion,
    alternarPlay,
    resetear,
    config,
    setConfig,
    plan,
    ballPos,
  } = useTableOfDT()

  const rutasActivas = useMemo(() => {
    const rutas = { ...(plan?.rutasPreview ?? {}) }
    if (jugadorSeleccionadoId && plan?.rutasPreview?.[jugadorSeleccionadoId]) {
      rutas[jugadorSeleccionadoId] = plan.rutasPreview[jugadorSeleccionadoId]
    }
    return rutas
  }, [jugadorSeleccionadoId, plan])

  return (
    <div className="min-h-dvh bg-slate-950 text-white">
      

      <main id="main" className="mx-auto max-w-6xl px-4 py-8">

     <TabletNavbarComponent />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                Editor de jugadas · beta
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Tablero táctico
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Arrastrá jugadores y reproducí una demo para ver el “flujo”.
                Esto es la base para luego simular movimientos, tiempos y decisiones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={alternarPlay}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95"
              >
                {isReproduciendo ? "Pausar demo" : "Reproducir demo"}
              </button>
              <button
                type="button"
                onClick={resetear}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[260px_1fr_260px]">
            {/* Panel izquierdo */}
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/80">Jugada</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="text-sm font-semibold text-white/80">{jugadaActiva.nombre}</div>
                <div className="mt-1 text-xs text-white/50">
                  Demo: {config.modoReaccion === "cortar" ? "corte" : "continuar"}
                  {config.modoReaccion === "cortar" ? ` → ${config.modoPostCorte}` : ""} ·{" "}
                  {Math.round((plan?.duracionMs ?? 0) / 100) / 10}s
                </div>
              </div>

              <div className="mt-5 text-sm font-semibold text-white/80">Jugador seleccionado</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                {jugadorSeleccionado ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white/80">
                        #{jugadorSeleccionado.numero} {jugadorSeleccionado.nombre}
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                        {jugadorSeleccionado.equipo}
                      </span>
                    </div>
                    <div className="text-xs text-white/50">
                      Posición: x {Math.round(jugadorSeleccionado.x * 100)}% · y{" "}
                      {Math.round(jugadorSeleccionado.y * 100)}%
                    </div>
                    <div className="text-xs text-white/50">
                      Tip: arrastralo dentro de la cancha.
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-white/50">Seleccioná un jugador.</div>
                )}
              </div>

              <div className="mt-5 text-sm font-semibold text-white/80">Acciones (próx.)</div>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  Definir ruta por puntos (click en cancha)
                </li>
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  Balón + pases + timing
                </li>
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  Guardar / cargar jugadas
                </li>
              </ul>
            </aside>

            {/* Tablero / Cancha */}
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/80">Cancha</div>
                <div className="text-xs text-white/50">
                  {isReproduciendo ? "Reproduciendo…" : "Listo"}
                  {" · "}22 jugadores + balón
                </div>
              </div>

              <div className="mt-4">
                <div
                  ref={refTablero}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950 to-slate-950"
                >
                  <div className="absolute inset-0 opacity-70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.12),transparent_45%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10%_10%]" />
                  </div>

                  <PitchLayer
                    rutas={rutasActivas}
                    progresoAnimacion={progresoAnimacion}
                    isReproduciendo={isReproduciendo}
                  />

                  {jugadores.map((jugador) => (
                    <PlayerToken
                      key={jugador.id}
                      jugador={jugador}
                      isSeleccionado={jugador.id === jugadorSeleccionadoId}
                      onPointerDown={onPointerDownJugador}
                    />
                  ))}

                  <BallToken ballPos={ballPos} />

                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white/60">
                    Arrastrá fichas (editor) · Play = jugada + reacción rival
                  </div>
                </div>
              </div>
            </section>

            {/* Panel derecho */}
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/80">Timeline</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Progreso</span>
                  <span className="tabular-nums">{Math.round(progresoAnimacion * 100)}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${Math.round(progresoAnimacion * 100)}%` }}
                  />
                </div>
                <div className="mt-3 text-xs text-white/50">
                  Próximo: editar keyframes por jugador, velocidades y pausas.
                </div>
              </div>

              <div className="mt-5 text-sm font-semibold text-white/80">Reacción rival</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                <div className="text-xs text-white/60">Modo</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isReproduciendo}
                    onClick={() => setConfig((prev) => ({ ...prev, modoReaccion: "continuar" }))}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                      config.modoReaccion === "continuar"
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                  >
                    Continuar
                  </button>
                  <button
                    type="button"
                    disabled={isReproduciendo}
                    onClick={() => setConfig((prev) => ({ ...prev, modoReaccion: "cortar" }))}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                      config.modoReaccion === "cortar"
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                  >
                    Cortar
                  </button>
                </div>

                {config.modoReaccion === "cortar" ? (
                  <div className="mt-4">
                    <div className="text-xs text-white/60">Después de cortar</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={isReproduciendo}
                        onClick={() => setConfig((prev) => ({ ...prev, modoPostCorte: "pases" }))}
                        className={[
                          "rounded-lg border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                          config.modoPostCorte === "pases"
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                        ].join(" ")}
                      >
                        1-2 pases y fin
                      </button>
                      <button
                        type="button"
                        disabled={isReproduciendo}
                        onClick={() => setConfig((prev) => ({ ...prev, modoPostCorte: "contraataque" }))}
                        className={[
                          "rounded-lg border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                          config.modoPostCorte === "contraataque"
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                        ].join(" ")}
                      >
                        Contraataque
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 text-xs text-white/50">
                  Si movés jugadores (editor), el plan se recalcula. Para ver el cambio, apretá Play.
                </div>
              </div>

              <div className="mt-5 text-sm font-semibold text-white/80">Notas</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white/60">
                Ahora la demo ya es 11v11 + balón y tu equipo se mueve. El rival reacciona según el modo elegido.
                Para “Harry Potter”, el siguiente paso es “trail” persistente por pase/movimiento y partículas.
              </div>

              <div className="mt-5 text-xs text-white/50">
                Tip técnico: esto está hecho sin librerías extra; si querés 3D/efectos fuertes, Three.js te sirve, pero conviene integrar con una capa React (te cuento cuál).
              </div>
            </aside>
          </div>
        </div>
      </main>

    </div>
  )
}
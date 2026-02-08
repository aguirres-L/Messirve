import { Link } from "react-router-dom"

export default function About() {
  // Este componente no recibe props
  const listaBeneficios = [
    "Pensar como DT: decidir, ajustar y anticipar escenarios.",
    "Practicar secuencias: inicio → desarrollo → finalización.",
    "Aprender más rápido: probar variantes sin fricción.",
  ]

  const listaComoFunciona = [
    {
      titulo: "Armás la jugada",
      descripcion: "Ubicás jugadores, definís movimientos y tiempos.",
    },
    {
      titulo: "La ejecutás",
      descripcion: "Reproducís la secuencia para ver el flujo completo.",
    },
    {
      titulo: "Probás variantes",
      descripcion: "Cambiás decisiones y evaluás finales distintos.",
    },
  ]

  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              Para futuros DT · táctica aplicada · práctica guiada
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Entrená jugadas como si fueran un tablero: claro, repetible y con
              variantes.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Messirve busca que puedas <span className="text-white/80">formular</span>{" "}
              una jugada, ejecutarla y ver cómo puede terminar de diferentes
              maneras. La idea es reducir la fricción entre “imaginar” táctica y
              “entenderla” con claridad.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95"
              >
                Ir al tablero (home)
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Ver propósito
              </Link>
            </div>

            <ul className="mt-8 space-y-3">
              {listaBeneficios.map((beneficio) => (
                <li key={beneficio} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-white/70">
                    ✓
                  </span>
                  <span className="text-sm text-white/70">{beneficio}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-base font-semibold text-white">
              Cómo funciona (simple)
            </h2>
            <p className="mt-2 text-sm text-white/60">
              El objetivo es que tu aprendizaje sea práctico: crear, ejecutar y
              ajustar.
            </p>

            <ol className="mt-6 space-y-4">
              {listaComoFunciona.map((paso, index) => (
                <li key={paso.titulo} className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white/80 ring-1 ring-white/10">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">
                      {paso.titulo}
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                      {paso.descripcion}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <div className="text-sm font-semibold text-white/80">
                CTA recomendado
              </div>
              <p className="mt-1 text-sm text-white/60">
                Cuando implementemos el editor, este botón va a iniciar tu
                primera jugada en 1 clic.
              </p>
              <Link
                to="/tablet"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/20"
              >
                Crear mi primera jugada
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs text-white/50">
            Nota: el objetivo no es “automatizar” decisiones, sino ayudarte a
            visualizar opciones, consecuencias y patrones tácticos.
          </p>
        </div>
      </div>
    </section>
  )
}
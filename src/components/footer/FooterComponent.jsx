export default function FooterComponent() {
  // Este componente no recibe props
  const anioActual = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="text-base font-semibold text-white">Messirve</div>
            <p className="text-sm text-white/60">
              Plataforma para que futuros DT practiquen jugadas en un tablero y
              exploren resultados posibles.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-white/80">Producto</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <span className="cursor-not-allowed" title="Próximamente">
                  Tablero
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed" title="Próximamente">
                  Editor de jugadas
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed" title="Próximamente">
                  Biblioteca de ejercicios
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-white/80">Recursos</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  className="hover:text-white"
                  href="https://react.dev"
                  target="_blank"
                  rel="noreferrer"
                >
                  React
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://reactrouter.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  React Router
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tailwind CSS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <div>© {anioActual} Messirve. Todos los derechos reservados.</div>
          <div className="text-white/40">
            Hecho para aprender táctica, no para reemplazar el criterio del DT.
          </div>
        </div>
      </div>
    </footer>
  )
}
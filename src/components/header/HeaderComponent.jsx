import { Link } from "react-router-dom"
import logo from "../../../public/anime.png"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Aos from "aos"
import AosAnimate from "../hooks_components/UseAOS.jsx"
import { useNavigate } from "react-router-dom"

export default function HeaderComponent() {
  // Este componente no recibe props
  const [isModalAbierto, setIsModalAbierto] = useState(false)

  const abrirModal = () => setIsModalAbierto(true)
  const cerrarModal = () => setIsModalAbierto(false)

  useEffect(() => {
    if (!isModalAbierto) return

    // Bloquea el scroll del fondo mientras el modal está abierto
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // AOS necesita refrescar cuando agregamos nodos al DOM (el modal aparece dinámicamente)
    Aos.refresh()

    const onKeyDown = (event) => {
      if (event.key === "Escape") cerrarModal()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = overflowPrevio
    }
  }, [isModalAbierto])

  return (
    <header className=" top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Ir al contenido
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950">
              <button
                type="button"
                onClick={abrirModal}
                className="inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                aria-label="Ver imagen del logo en grande"
              >
                <img src={logo} alt="Messirve" className="h-11 w-11 rounded-full" />
              </button>
            </span>
            <div className="leading-tight">
              <div className="text-base font-semibold text-white group-hover:text-white/90">
                Messirve
              </div>
              <div className="text-xs text-white/60">
                Tablero de jugadas para DT (beta)
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
          >
            Inicio
          </Link>

          <Link
            to="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white"
          >
            About
          </Link>

          <span
            className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-white/40"
            aria-disabled="true"
            title="Próximamente"
          >
            Tablero
          </span>
          <span
            className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-white/40"
            aria-disabled="true"
            title="Próximamente"
          >
            Jugadas
          </span>
          <span
            className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-white/40"
            aria-disabled="true"
            title="Próximamente"
          >
            Biblioteca
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 md:inline-flex"
            disabled
            aria-disabled="true"
            title="Próximamente"
          >
            Entrar
          </button>
          <Link
            to="/tablet"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
            Entrar al tablero
          </Link>
        </div>
      </div>

      {isModalAbierto ? (
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa del logo"
            onClick={cerrarModal}
          >
            <AosAnimate
              animacion="zoom-in"
              duracionMs={260}
              easing="ease-out-cubic"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/80">Logo</div>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <img
                  src={logo}
                  alt="Messirve"
                  className="h-56 w-56 rounded-2xl object-cover ring-1 ring-white/10"
                />
              </div>

              <p className="mt-4 text-xs text-white/50">
                Tip: también podés cerrar con <span className="text-white/70">Esc</span> o
                tocando afuera.
              </p>
            </AosAnimate>
          </div>,
          document.body
        )
      ) : null}
    </header>
  )
}
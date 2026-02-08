import { Link } from "react-router-dom";

export default function FooterComponent() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3  md:items-center md:justify-between">
          <p className="text-sm text-white/70">
            Messirve es una plataforma para comparar los componentes de tu PC con los requisitos de los juegos
            y ayudarte a evaluar si tu equipo puede correrlos. Integra datos y herramientas de RAWG.
          </p>

          <nav aria-label="Navegación del footer" className="flex items-center gap-4">
            <Link to="/rawg" className="text-sm font-medium text-white/80 hover:text-white">
              sobre RAWG
            </Link>

          </nav>
        </div>

        <p className="mt-4 text-xs text-white/50">© 2026 Messirve.</p>
      </div>
    </footer>
  );
}
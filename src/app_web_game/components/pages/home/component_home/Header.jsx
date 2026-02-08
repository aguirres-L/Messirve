import { Link } from "react-router-dom"
import imgMessirve from "../../../../../../public/anime.png"

export default function HeaderComponent() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
        <Link
          to="/"
          className="text-lg font-semibold tracking-wide text-white hover:text-white/90"
          aria-label="Ir al inicio"
        >
          <img src={imgMessirve} alt="Messirve" className="h-11 w-11 rounded-full" />
          <span className="text-lg font-semibold tracking-wide text-white hover:text-white/90">Messirve</span>  
        </Link>
      </div>
    </header>
  )
}
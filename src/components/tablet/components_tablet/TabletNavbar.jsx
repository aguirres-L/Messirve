import { Link } from "react-router-dom";
import logo from "../../../../public/anime.png";

export default function TabletNavbarComponent() {
  return (
    <nav className="mx-auto max-w-6xl px-4 py-3">
      <Link to="/" className="group flex items-center gap-2">
        <img src={logo} alt="Messirve" className="h-11 w-11 rounded-full" />
      </Link>
    </nav>
  )
}
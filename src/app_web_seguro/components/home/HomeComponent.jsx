import { useNavigate } from "react-router-dom";
import "./HomeComponent.css";

/**
 * Home de acceso interno: plataforma operativa para el dueño de la aseguradora.
 * Los brokers suben información de bienes; aquí se consulta y se carga de forma
 * manual a la calculadora de seguros externa. No es landing pública de captación.
 */
export default function HomeComponent() {
  const navegar = useNavigate();

  return (
    <div className="seguro-home">
      <main className="seguro-home__main seguro-home__main--centered">
        <div className="seguro-home__container seguro-home__container--narrow">
          <p className="seguro-home__eyebrow">Acceso operativo</p>
          <h1 className="seguro-home__title seguro-home__title--compact">
            Panel de operaciones
          </h1>
          <p className="seguro-home__subtitle seguro-home__subtitle--compact">
            Consultá la información que cargan los brokers y utilizala en tu
            calculadora de seguros.
          </p>
          <div className="seguro-home__actions seguro-home__actions--single">
            <button
              type="button"
              className="seguro-home__btn seguro-home__btn--primary"
              onClick={() => navegar("/admin")}
            >
              Acceder
            </button>
          </div>
        </div>
      </main>

      <footer className="seguro-home__footer">
        <div className="seguro-home__container seguro-home__footerGrid">
          <span className="seguro-home__small">
            © {new Date().getFullYear()}  Uso interno.
          </span>
          <button
            type="button"
            className="seguro-home__link seguro-home__link--btn"
            onClick={() => navegar("/admin")}
          >
            Ingresar
          </button>
        </div>
      </footer>
    </div>
  );
}

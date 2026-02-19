import "./LoginComponent.css";
import { useLogin } from "./useLogin";

export default function LoginComponent() {
  const {
    correo,
    contrasena,
    isCargando,
    isValido,
    mensajeDeError,
    returnTo,
    onCambiarCorreo,
    onCambiarContrasena,
    onIngresar,
    onAutocompletarDemo,
  } = useLogin();

  return (
    <div className="seguro-login">
      <div className="seguro-login__card">
        <header className="seguro-login__header">
          <p className="seguro-login__eyebrow">Messirve · Seguro Web</p>
          <h1 className="seguro-login__title">Ingresar</h1>
          <p className="seguro-login__subtitle">
            Accedé a tu dashboard según tu rol (usuario o cliente).
          </p>
        </header>

        <form className="seguro-login__form" onSubmit={onIngresar}>
          <label className="seguro-login__label">
            Correo
            <input
              className="seguro-login__input"
              type="email"
              autoComplete="email"
              placeholder="tu-correo@dominio.com"
              value={correo}
              onChange={(e) => onCambiarCorreo(e.target.value)}
              disabled={isCargando}
              required
            />
          </label>

          <label className="seguro-login__label">
            Contraseña
            <input
              className="seguro-login__input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => onCambiarContrasena(e.target.value)}
              disabled={isCargando}
              required
            />
          </label>

          {!!mensajeDeError && (
            <div className="seguro-login__error" role="alert">
              {mensajeDeError}
            </div>
          )}

          <button
            className="seguro-login__btn seguro-login__btn--primary"
            type="submit"
            disabled={!isValido || isCargando}
          >
            {isCargando ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="seguro-login__help">
            <span className="seguro-login__helpText">
              Demo rápida (password: <strong>1234</strong>)
            </span>
            <div className="seguro-login__helpBtns">
              <button
                type="button"
                className="seguro-login__btn seguro-login__btn--ghost"
                onClick={() => onAutocompletarDemo("usuario")}
                disabled={isCargando}
              >
                Soy usuario
              </button>
              <button
                type="button"
                className="seguro-login__btn seguro-login__btn--ghost"
                onClick={() => onAutocompletarDemo("cliente")}
                disabled={isCargando}
              >
                Soy cliente
              </button>
            </div>
            <span className="seguro-login__helpSmall">
              Luego de ingresar, te llevo a: <code>{returnTo}</code>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

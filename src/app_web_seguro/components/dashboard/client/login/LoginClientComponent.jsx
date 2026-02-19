import { Link } from "react-router-dom";
import "../../../login/LoginComponent.css";
import "./SecureAdminLogin.css";
import { useLoginClient } from "./useLoginClient";

export default function LoginClientComponent() {
  const {
    correo,
    contrasena,
    isCargando,
    isValido,
    isPasswordVisible,
    mensajeDeError,
    returnTo,
    isSesionActiva,
    rolActual,
    correoActual, 
    onCambiarCorreo,
    onCambiarContrasena,
    onTogglePasswordVisible,
    onAutocompletarDemo,
    onIngresar,
    onCerrarSesion,
  } = useLoginClient();

  return (
    <div className="seguro-login">
      <div className="seguro-login__card">
        <header className="seguro-login__header">
          <h1 className="seguro-login__title">Acceso Cliente</h1>
          <p className="seguro-login__subtitle">
            Ingresá para ver tu dashboard.
          </p>
        </header>

        {isSesionActiva ? (
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            <div className="seguro-login__meta">
              <div>
                Sesión: <strong>activa</strong>
              </div>
              <div>
                Rol: <strong>{rolActual ?? "—"}</strong>
              </div>
              {!!correoActual && (
                <div>
                  Identidad: <strong>{correoActual}</strong>
                </div>
              )}
            </div>

            <div className="seguro-login__actionsRow">
              <Link className="seguro-login__btn seguro-login__btn--ghost" to="/cliente">
                Ir a dashboard
              </Link>
              <button className="seguro-login__btn" type="button" onClick={onCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <form className="seguro-login__form" onSubmit={onIngresar} style={{ marginTop: 12 }}>
            <label className="seguro-login__label">
              Email o nombre
              <input
                className="seguro-login__input"
                type="text"
                autoComplete="username"
                placeholder="email o nombre de usuario"
                value={correo}
                onChange={(e) => onCambiarCorreo(e.target.value)}
                disabled={isCargando}
                required
              />
            </label>

            <label className="seguro-login__label">
              Password
              <div className="seguro-login__row">
                <input
                  className="seguro-login__input"
                  type={isPasswordVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => onCambiarContrasena(e.target.value)}
                  disabled={isCargando}
                  required
                />
                <button
                  className="seguro-login__toggle"
                  type="button"
                  onClick={onTogglePasswordVisible}
                  disabled={isCargando}
                  aria-pressed={isPasswordVisible}
                >
                  {isPasswordVisible ? "Ocultar" : "Ver"}
                </button>
              </div>
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

 {/*            <div className="seguro-login__help">
              <span className="seguro-login__helpText">
                Demo rápida (password: <strong>1234</strong>)
              </span>
              <div className="seguro-login__helpBtns">
                <button
                  type="button"
                  className="seguro-login__btn seguro-login__btn--ghost"
                  onClick={() => onAutocompletarDemo("cliente")}
                  disabled={isCargando}
                >
                  Soy cliente
                </button>
                <button
                  type="button"
                  className="seguro-login__btn seguro-login__btn--ghost"
                  onClick={() => onAutocompletarDemo("admin")}
                  disabled={isCargando}
                >
                  Soy admin
                </button>
              </div>
              <span className="seguro-login__helpSmall">
                Luego de ingresar, te llevo a: <code>{returnTo ?? "/cliente"}</code>
              </span>
              <span className="seguro-login__helpSmall">
                <Link to="/" style={{ color: "rgba(230,232,255,0.92)", textDecoration: "underline" }}>
                  Volver a Home
                </Link>
              </span>
            </div> */}
          </form>
        )}
      </div>
    </div>
  );
}
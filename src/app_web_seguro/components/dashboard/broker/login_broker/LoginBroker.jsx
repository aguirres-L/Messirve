import { Link } from "react-router-dom";
import "./LoginBroker.css";
import "../SecureAdminLogin.css";
import { useBrokerLogin } from "./useBrokerLogin";

export default function LoginBroker() {
  const {
    nombreDeBroker,
    contrasena,
    isCargando,
    isValido,
    isPasswordVisible,
    mensajeDeError, 
    mensajeDeExito,
    isSesionActiva,
    rolActual,
    correoActual,
    isBloqueado,
    tiempoBloqueoSegundos,
    onCambiarNombreDeBroker,
    onCambiarContrasena,
    onTogglePasswordVisible,
    onIngresar,
    onCerrarSesion,
  } = useBrokerLogin();

  const disabled = isCargando || isBloqueado;

  return (
    <div className="seguro-login">
      <div className="seguro-login__card">
        <header className="seguro-login__header">
          <h1 className="seguro-login__title">Acceso Broker</h1>
          <p className="seguro-login__subtitle">
            Formulario de solicitud de cotización reforzado. Solo se permite acceder con credenciales{" "}
            <strong>solicitadas y autorizadas previamente</strong>.
          </p>
        </header>
        
        {isSesionActiva ? (
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {!!mensajeDeExito && (
              <div className="seguro-login__success" role="status">
                {mensajeDeExito}
              </div>
            )}

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
              <Link className="seguro-login__btn seguro-login__btn--ghost" to="/broker/formulario">
                Ir a formulario
              </Link>
              <button className="seguro-login__btn" type="button" onClick={onCerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <form className="seguro-login__form" onSubmit={onIngresar} style={{ marginTop: 12 }}>
            <label className="seguro-login__label">
              Nombre de broker
              <input
                className="seguro-login__input"
                type="text"
                autoComplete="username"
                placeholder="nombre de broker"
                value={nombreDeBroker}
                onChange={(e) => onCambiarNombreDeBroker(e.target.value)}
                disabled={disabled}
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
                  disabled={disabled}
                  required
                />
                <button
                  className="seguro-login__toggle"
                  type="button"
                  onClick={onTogglePasswordVisible}
                  disabled={disabled}
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

            {isBloqueado && (
              <div className="seguro-login__error" role="alert">
                Bloqueo activo. Intentá nuevamente en <strong>{tiempoBloqueoSegundos}s</strong>.
              </div>
            )}

            <button
              className="seguro-login__btn seguro-login__btn--primary"
              type="submit"
              disabled={!isValido || disabled}
            >
              {isCargando ? "Verificando..." : "Iniciar sesión"}
            </button>

          
          </form>
        )}
      </div>
    </div>
  );
}

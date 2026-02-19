import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  cerrarSesionSegura,
  leerSesionSegura,
  obtenerRolDesdeSesion,
} from "../../../../router/segurity_Router/seguridadNavigation.js";
import "../../../login/LoginComponent.css";
import "../../broker/SecureAdminLogin.css";
import "../../../dashboard/dashboard-shell.css";
import "./FormularioBroker.css";
import { useBrokerFormulario } from "./useBrokerFormulario.js";

const PAISES = [
  "Argentina", "Bahamas", "Barbados", "Belice", "Islas Caimán", "Chile",
  "Costa Rica", "República Dominicana", "El Salvador", "Guatemala", "Honduras",
  "Jamaica", "México", "Panamá", "Paraguay", "Perú", "Trinidad y Tobago",
  "Estados Unidos", "Uruguay",
];

export default function FormularioBroker() {
  const navegar = useNavigate();
  const sesion = leerSesionSegura();
  const rol = obtenerRolDesdeSesion(sesion);
  const correoBroker = sesion?.usuario?.correo ?? sesion?.usuario?.email ?? null;
  const nombreBroker = sesion?.usuario?.nombre ?? null;

  const {
    data,
    errores,
    isEnviando,
    mensajeOk,
    onChange,
    onToggle,
    onArchivos,
    onAgregarAeronave,
    onCalcularPrima,
    onEnviar,
  } = useBrokerFormulario({ correoBroker, nombreBroker });

  const onCerrarSesion = () => {
    cerrarSesionSegura();
    navegar("/broker", { replace: true });
  };

  const hayErroresValidacion = Object.keys(errores).filter((k) => k !== "envio").length > 0;
  useEffect(() => {
    if (hayErroresValidacion) {
      document.getElementById("form-errores-validacion")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [hayErroresValidacion]);

  return (
    <div className="seguro-login form-broker-page">
      <div className="seguro-login__card">
        <header className="seguro-login__header">
          <h1 className="seguro-login__title">Nueva cotización</h1>
          <p className="seguro-login__subtitle">
            Completá los datos para generar una cotización. En esta versión el envío es simulado (sin backend).
          </p>
          {(nombreBroker || correoBroker) && (
            <div className="seguro-login__meta form-broker__broker-meta" style={{ marginTop: 12 }} aria-label="Broker que carga el formulario">
              <strong>Nombre broker : {nombreBroker || "—"}</strong>
             
            </div>
          )}
        </header>

        {!!mensajeOk && (
          <div className="seguro-login__success" role="status" style={{ marginTop: 12 }}>
            {mensajeOk}
          </div>
        )}

        {!!errores.envio && (
          <div className="seguro-banner seguro-banner--error" role="alert" style={{ marginTop: 12 }}>
            {errores.envio}
          </div>
        )}

        {Object.keys(errores).filter((k) => k !== "envio").length > 0 && (
          <div className="seguro-banner seguro-banner--error" role="alert" style={{ marginTop: 12 }} id="form-errores-validacion">
            <strong>Revisá los siguientes campos:</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
              {Object.entries(errores)
                .filter(([k]) => k !== "envio")
                .map(([key, msg]) => (
                  <li key={key}>{msg}</li>
                ))}
            </ul>
          </div>
        )}

        <form className="seguro-form" onSubmit={onEnviar} style={{ marginTop: 14 }}>
          {/* --- Nueva cotización --- */}
          <section className="form-broker__section" aria-label="Nueva cotización">
            <h2 className="form-broker__section-title">Nueva cotización</h2>
            <div className="form-broker__row-2">
              <label className="seguro-field">
                Producto de seguro
                <select
                  className="seguro-select"
                  value={data.cotizacion?.productoSeguro ?? ""}
                  onChange={(e) => onChange("cotizacion.productoSeguro", e.target.value)}
                  disabled={isEnviando}
                >
                  <option value="aviacion-general">Aviación general</option>
                  <option value="otros">Otros</option>
                </select>
              </label>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <label className="seguro-field" style={{ flex: 1 }}>
                  País del asegurado original
                  <select
                    className="seguro-select"
                    value={data.cotizacion?.paisAseguradoOriginal ?? ""}
                    onChange={(e) => onChange("cotizacion.paisAseguradoOriginal", e.target.value)}
                    disabled={isEnviando}
                  >
                    <option value="">Seleccionar uno</option>
                    {PAISES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="seguro-login__btn seguro-login__btn--primary"
                  disabled={isEnviando}
                >
                  Buscar
                </button>
              </div>
            </div>
            <label className="seguro-field" style={{ marginTop: 12 }}>
              Asegurado original <strong>*</strong>
              <input
                className="seguro-input"
                value={data.cotizacion?.aseguradoOriginal ?? ""}
                onChange={(e) => onChange("cotizacion.aseguradoOriginal", e.target.value)}
                placeholder="Nombre o razón social del asegurado"
                disabled={isEnviando}
              />
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                El asegurado nombrado no puede ser propietario de aeronaves y solo puede ser entidades comerciales.
              </span>
            </label>
          </section>

          {/* --- Dirección del asegurado --- */}
          <section className="form-broker__section" aria-label="Dirección del asegurado">
            <h2 className="form-broker__section-title">Dirección del asegurado</h2>
            <div className="form-broker__row-2">
              <label className="seguro-field">
                Primera línea de dirección <strong>*</strong>
                <input
                  className="seguro-input"
                  value={data.direccionAsegurado?.primeraLinea ?? ""}
                  onChange={(e) => onChange("direccionAsegurado.primeraLinea", e.target.value)}
                  placeholder="Calle, número"
                  disabled={isEnviando}
                />
                {!!errores.primeraLinea && (
                  <div className="seguro-banner seguro-banner--error">{errores.primeraLinea}</div>
                )}
              </label>
              <label className="seguro-field">
                Segunda línea de dirección
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="seguro-input"
                    style={{ flex: 1 }}
                    value={data.direccionAsegurado?.segundaLinea ?? ""}
                    onChange={(e) => onChange("direccionAsegurado.segundaLinea", e.target.value)}
                    placeholder="Opcional"
                    disabled={isEnviando}
                  />
                  <button type="button" className="seguro-login__btn seguro-login__btn--primary" disabled={isEnviando}>
                    Ir a
                  </button>
                </div>
              </label>
              <label className="seguro-field">
                Ciudad <strong>*</strong>
                <input
                  className="seguro-input"
                  value={data.direccionAsegurado?.ciudad ?? ""}
                  onChange={(e) => onChange("direccionAsegurado.ciudad", e.target.value)}
                  placeholder="Ciudad"
                  disabled={isEnviando}
                />
                {!!errores.ciudad && (
                  <div className="seguro-banner seguro-banner--error">{errores.ciudad}</div>
                )}
              </label>
              <label className="seguro-field">
                Estado / Condado
                <input
                  className="seguro-input"
                  value={data.direccionAsegurado?.estadoCondado ?? ""}
                  onChange={(e) => onChange("direccionAsegurado.estadoCondado", e.target.value)}
                  placeholder="Opcional"
                  disabled={isEnviando}
                />
              </label>
              <label className="seguro-field">
                Código postal
                <input
                  className="seguro-input"
                  value={data.direccionAsegurado?.codigoPostal ?? ""}
                  onChange={(e) => onChange("direccionAsegurado.codigoPostal", e.target.value)}
                  placeholder="Opcional"
                  disabled={isEnviando}
                />
              </label>
              <label className="seguro-field">
                País de operación <strong>*</strong>
                <select
                  className="seguro-select"
                  value={data.direccionAsegurado?.paisOperacion ?? ""}
                  onChange={(e) => onChange("direccionAsegurado.paisOperacion", e.target.value)}
                  disabled={isEnviando}
                >
                  <option value="">Seleccionar uno</option>
                  {PAISES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {!!errores.paisOperacion && (
                  <div className="seguro-banner seguro-banner--error">{errores.paisOperacion}</div>
                )}
              </label>
            </div>
          </section>

          {/* --- Intermediarios --- */}
          <section className="form-broker__section" aria-label="Intermediarios">
            <h2 className="form-broker__section-title">Intermediarios</h2>
            <div className="form-broker__row-2">
              <label className="seguro-field">
                Referencia broker / UMR
                <input
                  className="seguro-input"
                  value={data.intermediarios?.referenciaBrokerUmr ?? ""}
                  onChange={(e) => onChange("intermediarios.referenciaBrokerUmr", e.target.value)}
                  placeholder="Opcional"
                  disabled={isEnviando}
                />
              </label>
              <label className="seguro-field">
                Contacto
                <input
                  className="seguro-input"
                  value={data.intermediarios?.contacto ?? ""}
                  onChange={(e) => onChange("intermediarios.contacto", e.target.value)}
                  placeholder="Ninguno ingresado"
                  disabled={isEnviando}
                />
              </label>
            </div>
          </section>

          {/* --- Método de colocación --- */}
          <section className="form-broker__section" aria-label="Método de colocación">
            <h2 className="form-broker__section-title">Método de colocación</h2>
            <label className="seguro-field" style={{ maxWidth: 320 }}>
              Método de colocación
              <select
                className="seguro-select"
                value={data.metodoColocacion?.metodo ?? ""}
                onChange={(e) => onChange("metodoColocacion.metodo", e.target.value)}
                disabled={isEnviando}
              >
                <option value="">Seleccionar uno</option>
                <option value="directo">Directo</option>
                <option value="broker">Broker</option>
                <option value="otros">Otros</option>
              </select>
            </label>
          </section>

          {/* --- Detalles de la flota --- */}
          <section className="form-broker__section" aria-label="Detalles de la flota">
            <h2 className="form-broker__section-title">Detalles de la flota</h2>
            <div className="form-broker__toggle-wrap">
              <button
                type="button"
                className="form-broker__switch"
                role="switch"
                aria-checked={data.flota?.ingresarNuevaAeronave ?? false}
                data-active={data.flota?.ingresarNuevaAeronave ?? false}
                onClick={() => onToggle("flota.ingresarNuevaAeronave")}
                disabled={isEnviando}
              >
                <span className="form-broker__switch-thumb" />
              </button>
              <span>Ingresar nueva aeronave</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 12 }}>
              Seleccioná cualquier fila de la tabla de abajo para ver o actualizar sus detalles, o para eliminarla de la flota.
            </p>

            {data.flota?.ingresarNuevaAeronave && (
              <div style={{ marginTop: 20, padding: 16, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}>
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Datos de la aeronave</h3>
                <div className="form-broker__row-2">
                  <label className="seguro-field">
                    Tipo de ala <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.tipoAla ?? ""}
                      onChange={(e) => onChange("flotaDetalle.tipoAla", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="ala-fija">Ala fija</option>
                      <option value="rotor">Rotor</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    Matrícula de la aeronave <strong>*</strong>
                    <input
                      className="seguro-input"
                      value={data.flotaDetalle?.matricula ?? ""}
                      onChange={(e) => onChange("flotaDetalle.matricula", e.target.value)}
                      placeholder="Ej: XA-ABC"
                      disabled={isEnviando}
                    />
                  </label>
                  <label className="seguro-field">
                    Tipo de aeronave <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.tipoAeronave ?? ""}
                      onChange={(e) => onChange("flotaDetalle.tipoAeronave", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      <option value="jet">Jet</option>
                      <option value="turboprop">Turbohélice</option>
                      <option value="piston">Pistón</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    Año de fabricación <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.anioFabricacion ?? ""}
                      onChange={(e) => onChange("flotaDetalle.anioFabricacion", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                  </label>
                  <label className="seguro-field">
                    # Asientos de pasajeros <strong>*</strong>
                    <input
                      className="seguro-input"
                      type="number"
                      min={0}
                      value={data.flotaDetalle?.asientosPasajeros ?? ""}
                      onChange={(e) => onChange("flotaDetalle.asientosPasajeros", e.target.value)}
                      placeholder="0"
                      disabled={isEnviando}
                    />
                  </label>
                  <label className="seguro-field">
                    # Asientos de tripulación <strong>*</strong>
                    <input
                      className="seguro-input"
                      type="number"
                      min={0}
                      value={data.flotaDetalle?.asientosTripulacion ?? ""}
                      onChange={(e) => onChange("flotaDetalle.asientosTripulacion", e.target.value)}
                      placeholder="0"
                      disabled={isEnviando}
                    />
                  </label>
                  <label className="seguro-field">
                    Moneda del valor de la aeronave <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.monedaValor ?? "USD"}
                      onChange={(e) => onChange("flotaDetalle.monedaValor", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="USD">USD</option>
                      <option value="MXN">MXN</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    Valor acordado <strong>*</strong>
                    <input
                      className="seguro-input"
                      type="number"
                      min={0}
                      value={data.flotaDetalle?.valorAcordado ?? ""}
                      onChange={(e) => onChange("flotaDetalle.valorAcordado", e.target.value)}
                      placeholder="0"
                      disabled={isEnviando}
                    />
                  </label>
                  <label className="seguro-field">
                    Usos de la aeronave <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.usosAeronave ?? ""}
                      onChange={(e) => onChange("flotaDetalle.usosAeronave", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      <option value="comercial">Comercial</option>
                      <option value="privado">Privado</option>
                      <option value="entrenamiento">Entrenamiento</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    Garantía de piloto abierto <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.garantiaPilotoAbierto ?? ""}
                      onChange={(e) => onChange("flotaDetalle.garantiaPilotoAbierto", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    ¿Agregar garantía de copiloto piloto abierto?
                    <div className="form-broker__sino">
                      <button
                        type="button"
                        className="form-broker__sino-option"
                        data-selected={(data.flotaDetalle?.agregarGarantiaCopiloto ?? "no") === "si"}
                        onClick={() => onChange("flotaDetalle.agregarGarantiaCopiloto", "si")}
                        disabled={isEnviando}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        className="form-broker__sino-option"
                        data-selected={(data.flotaDetalle?.agregarGarantiaCopiloto ?? "no") === "no"}
                        onClick={() => onChange("flotaDetalle.agregarGarantiaCopiloto", "no")}
                        disabled={isEnviando}
                      >
                        No
                      </button>
                    </div>
                  </label>
                  <label className="seguro-field">
                    Utilización anual <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.utilizacionAnual ?? ""}
                      onChange={(e) => onChange("flotaDetalle.utilizacionAnual", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </label>
                  <label className="seguro-field">
                    Cobertura - Vuelo completo / GRO <strong>*</strong>
                    <select
                      className="seguro-select"
                      value={data.flotaDetalle?.coberturaFullFlightGro ?? ""}
                      onChange={(e) => onChange("flotaDetalle.coberturaFullFlightGro", e.target.value)}
                      disabled={isEnviando}
                    >
                      <option value="">Seleccionar uno</option>
                      <option value="completo">Vuelo completo</option>
                      <option value="gro">GRO</option>
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  className="seguro-login__btn seguro-login__btn--primary"
                  onClick={onAgregarAeronave}
                  disabled={isEnviando}
                  style={{ marginTop: 12 }}
                >
                  Agregar
                </button>
              </div>
            )}

            {data.flotaLista?.length > 0 && (
              <div style={{ marginTop: 12, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Matrícula</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Tipo</th>
                      <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.flotaLista.map((a, i) => (
                      <tr key={i}>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{a.matricula}</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{a.tipoAeronave}</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{a.valorAcordado} {a.monedaValor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* --- Añadir accidente personal --- */}
          <section className="form-broker__section" aria-label="Accidente personal">
            <h2 className="form-broker__section-title">Añadir accidente personal</h2>
            <div className="form-broker__sino">
              <button
                type="button"
                className="form-broker__sino-option"
                data-selected={(data.accidentePersonal?.incluir ?? "no") === "si"}
                onClick={() => onChange("accidentePersonal.incluir", "si")}
                disabled={isEnviando}
              >
                Sí
              </button>
              <button
                type="button"
                className="form-broker__sino-option"
                data-selected={(data.accidentePersonal?.incluir ?? "no") === "no"}
                onClick={() => onChange("accidentePersonal.incluir", "no")}
                disabled={isEnviando}
              >
                No
              </button>
            </div>
          </section>

          {/* --- Período del seguro --- */}
          <section className="form-broker__section" aria-label="Período del seguro">
            <h2 className="form-broker__section-title">Período del seguro</h2>
            <label className="seguro-field" style={{ maxWidth: 280 }}>
              Fecha de inicio <strong>*</strong>
              <input
                className="seguro-input"
                type="date"
                value={data.periodoSeguro?.fechaInicio ?? ""}
                onChange={(e) => onChange("periodoSeguro.fechaInicio", e.target.value)}
                disabled={isEnviando}
              />
              {!!errores.fechaInicio && (
                <div className="seguro-banner seguro-banner--error">{errores.fechaInicio}</div>
              )}
            </label>
          </section>

          {/* --- Límites de responsabilidad --- */}
          <section className="form-broker__section" aria-label="Límites de responsabilidad">
            <h2 className="form-broker__section-title">Límites de responsabilidad</h2>
            <div className="form-broker__row-2">
              <label className="seguro-field">
                Moneda para la sección de responsabilidad
                <select
                  className="seguro-select"
                  value={data.limitesResponsabilidad?.moneda ?? "USD"}
                  onChange={(e) => onChange("limitesResponsabilidad.moneda", e.target.value)}
                  disabled={isEnviando}
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className="seguro-field">
                Incluir responsabilidad a pilotos y tripulación
                <div className="form-broker__sino">
                  <button
                    type="button"
                    className="form-broker__sino-option"
                    data-selected={(data.limitesResponsabilidad?.incluirPilotosTripulacion ?? "no") === "si"}
                    onClick={() => onChange("limitesResponsabilidad.incluirPilotosTripulacion", "si")}
                    disabled={isEnviando}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className="form-broker__sino-option"
                    data-selected={(data.limitesResponsabilidad?.incluirPilotosTripulacion ?? "no") === "no"}
                    onClick={() => onChange("limitesResponsabilidad.incluirPilotosTripulacion", "no")}
                    disabled={isEnviando}
                  >
                    No
                  </button>
                </div>
              </label>
              <label className="seguro-field">
                Límite único combinado
                <select
                  className="seguro-select"
                  value={data.limitesResponsabilidad?.limiteUnicoCombinado ?? ""}
                  onChange={(e) => onChange("limitesResponsabilidad.limiteUnicoCombinado", e.target.value)}
                  disabled={isEnviando}
                >
                  <option value="">Seleccionar uno</option>
                  <option value="1m">1 M</option>
                  <option value="2m">2 M</option>
                  <option value="5m">5 M</option>
                  <option value="10m">10 M</option>
                </select>
              </label>
            </div>
          </section>

          {/* --- Pilotos nombrados --- */}
          <section className="form-broker__section" aria-label="Pilotos nombrados">
            <h2 className="form-broker__section-title">Pilotos nombrados</h2>
            <div className="form-broker__toggle-wrap">
              <button
                type="button"
                className="form-broker__switch"
                role="switch"
                aria-checked={data.pilotosNombrados?.agregarPilotos ?? false}
                data-active={data.pilotosNombrados?.agregarPilotos ?? false}
                onClick={() => onToggle("pilotosNombrados.agregarPilotos")}
                disabled={isEnviando}
              >
                <span className="form-broker__switch-thumb" />
              </button>
              <span>Añadir pilotos nombrados que cumplan la garantía de piloto abierto</span>
            </div>
            <p style={{ fontSize: 13, opacity: 0.85, marginTop: 12 }}>
              Seleccioná cualquier fila de la tabla de abajo para ver o actualizar sus detalles, o para eliminarla.
            </p>
            <div style={{ marginTop: 8, padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
              <strong style={{ fontSize: 13 }}>Pilotos</strong>
              <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.8 }}>
                {data.pilotosLista?.length ? `${data.pilotosLista.length} declarado(s)` : "Ninguno declarado"}
              </p>
            </div>
          </section>

          {/* --- Bonificación por no reclamaciones --- */}
          <section className="form-broker__section" aria-label="Bonificación por no reclamaciones">
            <h2 className="form-broker__section-title">Bonificación por no reclamaciones</h2>
            <label className="seguro-field" style={{ maxWidth: 360 }}>
              Bonificación por no reclamaciones / Comisión por beneficios
              <input
                className="seguro-input"
                value={data.noClaimsBonus?.valor ?? "Ninguno"}
                onChange={(e) => onChange("noClaimsBonus.valor", e.target.value)}
                placeholder="Ninguno"
                disabled={isEnviando}
              />
            </label>
          </section>

          {/* --- Experiencia --- */}
          <section className="form-broker__section" aria-label="Experiencia">
            <h2 className="form-broker__section-title">Experiencia</h2>
            <div className="form-broker__row-2">
              <label className="seguro-field">
                ¿El asegurado o sus pilotos han sufrido pérdidas en los últimos 3 años?
                <div className="form-broker__sino">
                  <button
                    type="button"
                    className="form-broker__sino-option"
                    data-selected={(data.experiencia?.perdidasUltimos3Anios ?? "no") === "si"}
                    onClick={() => onChange("experiencia.perdidasUltimos3Anios", "si")}
                    disabled={isEnviando}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className="form-broker__sino-option"
                    data-selected={(data.experiencia?.perdidasUltimos3Anios ?? "no") === "no"}
                    onClick={() => onChange("experiencia.perdidasUltimos3Anios", "no")}
                    disabled={isEnviando}
                  >
                    No
                  </button>
                </div>
              </label>
              <label className="seguro-field">
                Años de operación y aeronaves operadas
                <select
                  className="seguro-select"
                  value={data.experiencia?.anosOperacionAeronaves ?? ""}
                  onChange={(e) => onChange("experiencia.anosOperacionAeronaves", e.target.value)}
                  disabled={isEnviando}
                >
                  <option value="">Seleccionar uno</option>
                  <option value="1-3">1 a 3 años</option>
                  <option value="3-5">3 a 5 años</option>
                  <option value="5-10">5 a 10 años</option>
                  <option value="10+">Más de 10 años</option>
                </select>
              </label>
            </div>
          </section>

          {/* --- Impuestos aplicables --- */}
         {/*  <section className="form-broker__section" aria-label="Impuestos aplicables">
            <h2 className="form-broker__section-title">Impuestos aplicables</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Impuesto</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Monto</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Pagadero por</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Pagadero en</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} style={{ padding: "12px 16px", opacity: 0.8 }}>
                      Ninguno aplicable
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section> */}

          {/* --- Deducciones --- */}
         {/*  <section className="form-broker__section" aria-label="Deducciones">
            <h2 className="form-broker__section-title">Deducciones</h2>
            <label className="seguro-field" style={{ maxWidth: 200 }}>
              Comisión total (%)
              <input
                className="seguro-input"
                type="number"
                min={0}
                max={100}
                value={data.deducciones?.comisionTotalPorcentaje ?? 0}
                onChange={(e) => onChange("deducciones.comisionTotalPorcentaje", e.target.value === "" ? 0 : Number(e.target.value))}
                disabled={isEnviando}
              />
            </label>
          </section> */}

          {/* --- Calcular prima --- */}
        {/*   <div className="seguro-login__actionsRow" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="seguro-login__btn seguro-login__btn--primary"
              onClick={onCalcularPrima}
              disabled={isEnviando}
            >
              Calcular prima
            </button>
          </div> */}

          {/* --- Consentimientos --- */}
        {/*   <section className="form-broker__section" aria-label="Consentimientos" style={{ marginTop: 24 }}>
            <h2 className="form-broker__section-title">Consentimientos</h2>
            <div className="seguro-checks">
              <label className="seguro-check">
                <input
                  type="checkbox"
                  checked={data.consentimientos?.tratamientoDatos ?? false}
                  onChange={() => onToggle("consentimientos.tratamientoDatos")}
                  disabled={isEnviando}
                />
                <div>
                  <strong>Acepto tratamiento de datos <span aria-hidden="true">*</span></strong>
                  <div style={{ fontSize: 12, opacity: 0.78 }}>Necesario para iniciar la cotización.</div>
                  {!!errores.tratamientoDatos && (
                    <div className="seguro-banner seguro-banner--error" style={{ marginTop: 8 }}>{errores.tratamientoDatos}</div>
                  )}
                </div>
              </label>
              <label className="seguro-check">
                <input
                  type="checkbox"
                  checked={data.consentimientos?.contactoComercial ?? false}
                  onChange={() => onToggle("consentimientos.contactoComercial")}
                  disabled={isEnviando}
                />
                <div>
                  <strong>Acepto contacto comercial</strong>
                  <div style={{ fontSize: 12, opacity: 0.78 }}>Opcional.</div>
                </div>
              </label>
            </div>
          </section> */}

          <div className="seguro-login__actionsRow form-broker__actions">
            <button
              className="seguro-login__btn seguro-login__btn--primary"
              type="submit"
              disabled={isEnviando}
            >
              {isEnviando ? "Enviando…" : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

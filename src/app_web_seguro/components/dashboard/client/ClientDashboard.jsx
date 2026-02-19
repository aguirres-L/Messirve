import { useNavigate } from "react-router-dom";
import {
  cerrarSesionSegura,
  leerSesionSegura,
  obtenerRolDesdeSesion,
} from "../../../router/segurity_Router/seguridadNavigation.js";
import { formatoMoneda, formatoMonedaCorto } from "../../../utils/formatoMoneda.js";
import "../dashboard-shell.css";
import { useClientDashboard } from "./useClientDashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DetalleBien({ bien }) {
  const cot = bien?.cotizacion ?? {};
  const dir = bien?.direccionAsegurado ?? {};
  const inter = bien?.intermediarios ?? {};
  const flotaLista = Array.isArray(bien?.flotaLista) ? bien.flotaLista : [];
  const periodo = bien?.periodoSeguro ?? {};
  const broker = bien?.broker ?? {};
  const valorTotal = flotaLista.reduce((acc, a) => acc + (Number(a?.valorAcordado) || 0), 0);
  const monedaFlota = flotaLista[0]?.monedaValor || "USD";

  return (
    <div className="seguro-detalle-bien">
      <section className="seguro-detalle-bien__block" aria-labelledby="detalle-datos-generales">
        <h4 id="detalle-datos-generales" className="seguro-detalle-bien__heading">Datos del seguro</h4>
        <div className="seguro-kv">
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Producto</span>
            <span className="seguro-kv__value">{cot.productoSeguro === "aviacion-general" ? "Aviación general" : cot.productoSeguro || "—"}</span>
          </div>
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Asegurado original</span>
            <span className="seguro-kv__value">{cot.aseguradoOriginal || "—"}</span>
          </div>
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">País asegurado</span>
            <span className="seguro-kv__value">{cot.paisAseguradoOriginal || "—"}</span>
          </div>
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Período inicio</span>
            <span className="seguro-kv__value">{periodo.fechaInicio || "—"}</span>
          </div>
          <div className="seguro-kv__row seguro-kv__row--destacado">
            <span className="seguro-kv__label">Valor acordado flota (total)</span>
            <span className="seguro-kv__value">{valorTotal > 0 ? formatoMoneda(valorTotal, { moneda: monedaFlota }) : "—"}</span>
          </div>
        </div>
      </section>

      <section className="seguro-detalle-bien__block" aria-labelledby="detalle-ubicacion">
        <h4 id="detalle-ubicacion" className="seguro-detalle-bien__heading">Ubicación y contacto</h4>
        <div className="seguro-kv">
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Dirección</span>
            <span className="seguro-kv__value">
              {[dir.primeraLinea, dir.segundaLinea, dir.ciudad, dir.estadoCondado, dir.codigoPostal, dir.paisOperacion]
                .filter(Boolean)
                .join(", ") || "—"}
            </span>
          </div>
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Intermediarios (referencia / contacto)</span>
            <span className="seguro-kv__value">{inter.referenciaBrokerUmr || "—"} / {inter.contacto || "—"}</span>
          </div>
          <div className="seguro-kv__row">
            <span className="seguro-kv__label">Broker que cargó</span>
            <span className="seguro-kv__value">{broker.nombre || "—"} {broker.correo ? `(${broker.correo})` : ""}</span>
          </div>
        </div>
      </section>

      {flotaLista.length > 0 && (
        <section className="seguro-detalle-bien__block" aria-labelledby="detalle-flota">
          <h4 id="detalle-flota" className="seguro-detalle-bien__heading">Flota ({flotaLista.length})</h4>
          <div className="seguro-tabla-wrapper">
            <table className="seguro-tabla">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {flotaLista.map((a, i) => (
                  <tr key={i}>
                    <td>{a.matricula || "—"}</td>
                    <td>{a.tipoAeronave || "—"}</td>
                    <td>{a.valorAcordado != null ? formatoMoneda(Number(a.valorAcordado), { moneda: a.monedaValor || "USD" }) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ClientDashboard() {
  const navegar = useNavigate();

  const sesion = leerSesionSegura();
  const rol = obtenerRolDesdeSesion(sesion);
  const correo = sesion?.usuario?.correo ?? sesion?.usuario?.email ?? null;

  const {
    bienesTotales,
    bienes,
    bienSeleccionado,
    textoFiltro,
    resumen,
    onCambiarFiltro,
    onSeleccionarBien,
    isCargando,
    errorCarga,
    datosEstado,
    datosValorPorTipo,
    brokers,
  } = useClientDashboard();

  const coloresEstado = ["#6366f1", "#22c55e", "#f59e0b", "#f43f5e", "#38bdf8"];
  const mensajeProximoPaso = bienes.length === 0
    ? "Cuando un broker cargue una solicitud, aparecerá acá."
    : "Revisar bienes pendientes de inspección.";

  const onCerrarSesion = () => {
    cerrarSesionSegura();
    navegar("/admin", { replace: true });
  };

  return (
    <div className="seguro-dashboard">
      <div className="seguro-dashboard__container">
        <div className="seguro-dashboard__topbar">
          <div>
            <h2 className="seguro-dashboard__title">Dashboard · Cliente</h2>
            <p className="seguro-dashboard__intro" aria-hidden="true">
              Acá ves tus solicitudes de cotización, el valor acordado por producto y los brokers. Elegí una solicitud en la lista para ver el detalle.
            </p>
            <div className="seguro-dashboard__meta">
              <span className="seguro-dashboard__pill">
                Rol: <strong>{rol ?? "—"}</strong>
              </span>
              {!!correo && (
                <span className="seguro-dashboard__pill">
                  Sesión: <strong>{correo}</strong>
                </span>
              )}
              <span className="seguro-dashboard__pill">
                Solicitudes: <strong>{resumen.total}</strong>
              </span>
            </div>
          </div>

          <div className="seguro-dashboard__actions">
        
            <button className="seguro-dashboard__btn" type="button" onClick={onCerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {isCargando && (
          <div className="seguro-banner" style={{ marginBottom: 12 }} role="status">
            Cargando bienes y brokers…
          </div>
        )}
        {!!errorCarga && (
          <div className="seguro-banner seguro-banner--error" role="alert" style={{ marginBottom: 12 }}>
            {errorCarga}
          </div>
        )}

        <div className="seguro-dashboard__grid">
          
          <section className="seguro-card" aria-label="Panel de gráficos">
            <div className="seguro-card__header">
              <h3 className="seguro-card__title">Panel de gráficos</h3>
              <p className="seguro-card__subtitle">
                Solicitudes por producto y valor acordado (datos de bienes cargados por brokers).
              </p>
            </div>
            <div className="seguro-card__body">
              <div className="seguro-panel-graficos__grid">
                <div className="seguro-panel-graficos__item">
                  <div className="seguro-card__body">
                    <div className="seguro-panel-graficos__label">Solicitudes por producto</div>
                    <div className="seguro-panel-graficos__chart seguro-panel-graficos__chart--pie">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={datosEstado}
                            dataKey="cantidad"
                            nameKey="estado"
                            innerRadius={58}
                            outerRadius={86}
                            paddingAngle={2}
                          >
                            {datosEstado.map((_, idx) => (
                              <Cell key={idx} fill={coloresEstado[idx % coloresEstado.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            contentStyle={{
                              background: "rgba(10, 12, 24, 0.92)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 12,
                              color: "rgba(255,255,255,0.92)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                      {datosEstado.map((d, idx) => (
                        <span key={d.estado} className="seguro-dashboard__pill">
                          <span
                            aria-hidden="true"
                            style={{
                              display: "inline-block",
                              width: 10,
                              height: 10,
                              borderRadius: 999,
                              background: coloresEstado[idx % coloresEstado.length],
                              marginRight: 8,
                            }}
                          />
                          {d.estado}: <strong>{d.cantidad}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="seguro-panel-graficos__item">
                  <div className="seguro-card__body">
                    <div className="seguro-panel-graficos__label">Valor acordado total (USD) por producto</div>
                    <div className="seguro-panel-graficos__chart seguro-panel-graficos__chart--bar">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={datosValorPorTipo} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                          <XAxis dataKey="tipo" tick={{ fill: "rgba(255,255,255,0.78)", fontSize: 12 }} />
                          <YAxis
                            tick={{ fill: "rgba(255,255,255,0.78)", fontSize: 12 }}
                            tickFormatter={(v) => formatoMonedaCorto(v)}
                          />
                          <Tooltip
                            formatter={(value) => [formatoMoneda(Number(value) || 0, { compacto: true }), "USD"]}
                            contentStyle={{
                              background: "rgba(10, 12, 24, 0.92)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 12,
                              color: "rgba(255,255,255,0.92)",
                            }}
                          />
                          <Bar dataKey="valorUsd" fill="#22c55e" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="seguro-card" aria-label="Resumen">
            <div className="seguro-card__header">
              <h3 className="seguro-card__title">Resumen rápido</h3>
              <p className="seguro-card__subtitle">Indicadores para que el cliente entienda “qué está pasando”.</p>
            </div>
            <div className="seguro-card__body">
              <div className="seguro-resumen-kpi">
                <span className="seguro-resumen-kpi__label">Valor estimado total (USD)</span>
                <span className="seguro-resumen-kpi__value">{formatoMoneda(resumen.totalUsd)}</span>
              </div>
              <div className="seguro-kv seguro-kv--compact">
                <div className="seguro-kv__row">
                  <span className="seguro-kv__label">Próximo paso</span>
                  <span className="seguro-kv__value">{mensajeProximoPaso}</span>
                </div>
                <div className="seguro-kv__row">
                  <span className="seguro-kv__label">Atajo</span>
                  <span className="seguro-kv__value">
                    <a
                      className="seguro-dashboard__link seguro-dashboard__link--cta"
                      href="#bienes"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("bienes")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      Ir a solicitudes (bienes) →
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section id="bienes" className="seguro-card" aria-label="Bienes / solicitudes de brokers">
            <div className="seguro-card__header">
              <h3 className="seguro-card__title">Solicitudes de cotización (bienes)</h3>
              <p className="seguro-card__subtitle">
                Bienes que los brokers cargaron desde el formulario. Click en una fila para ver el detalle.
              </p>
            </div>
            <div className="seguro-card__body">
              <div className="seguro-split">
                <div>
                  <label className="seguro-field">
                    Buscar
                    <input
                      className="seguro-input"
                      value={textoFiltro}
                      onChange={(e) => onCambiarFiltro(e.target.value)}
                      placeholder="Asegurado, producto, broker, ciudad..."
                    />
                  </label>

                  <div className="seguro-list" role="listbox" aria-label="Lista de bienes">
                    {bienes.length === 0 ? (
                      <div className="seguro-banner" style={{ marginTop: 8 }}>
                        {isCargando ? "Cargando…" : "No hay solicitudes. Los brokers las cargan desde el formulario."}
                      </div>
                    ) : (
                      bienes.map((bien) => (
                        <button
                          key={bien.id}
                          type="button"
                          className="seguro-item"
                          aria-selected={bienSeleccionado?.id === bien.id}
                          onClick={() => onSeleccionarBien(bien.id)}
                        >
                          <div className="seguro-item__top">
                            <p className="seguro-item__name">{bien._titulo}</p>
                            <span className="seguro-item__tag">{bien._producto}</span>
                          </div>
                          <div className="seguro-item__meta">
                            <span>Broker: {bien._brokerNombre}</span>
                            <span>·</span>
                            <span>{bien._ubicacion}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="seguro-detalle-panel" aria-label="Detalle del bien seleccionado">
                  {!bienSeleccionado ? (
                    <div className="seguro-empty-state">
                      <p className="seguro-empty-state__title">Detalle de la solicitud</p>
                      <p className="seguro-empty-state__text">
                        {textoFiltro.trim()
                          ? "No hay resultados para tu búsqueda o la selección se perdió. Probá quitando el filtro."
                          : "Elegí una solicitud de la lista de la izquierda para ver aquí el detalle (producto, dirección, flota y valor acordado)."}
                      </p>
                    </div>
                  ) : (
                    <DetalleBien bien={bienSeleccionado} />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="seguro-card" aria-label="Brokers">
            <div className="seguro-card__header">
              <h3 className="seguro-card__title">Brokers</h3>
              <p className="seguro-card__subtitle">
                Brokers registrados (broker_data). Sin contraseña por seguridad.
              </p>
            </div>
            <div className="seguro-card__body">
              {brokers.length === 0 ? (
                <div className="seguro-banner">No hay brokers cargados.</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Nombre</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brokers.map((b) => (
                        <tr key={b.id}>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{b.name}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{b.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

      
        </div>
      </div>
    </div>
  );
}
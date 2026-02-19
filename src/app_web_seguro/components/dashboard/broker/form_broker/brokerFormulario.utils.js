const BORRADOR_CLAVE = "messirve_seguro_broker_form_borrador";

export function leerBorradorBroker() {
  try {
    const bruto = localStorage.getItem(BORRADOR_CLAVE);
    if (!bruto) return null;
    const data = JSON.parse(bruto);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export function guardarBorradorBroker(data) {
  localStorage.setItem(BORRADOR_CLAVE, JSON.stringify(data ?? {}));
}

export function limpiarBorradorBroker() {
  localStorage.removeItem(BORRADOR_CLAVE);
}

export function sumarMeses(fechaIso, meses) {
  if (!fechaIso) return null;
  const m = Number(meses);
  if (!Number.isFinite(m) || m <= 0) return null;

  const base = new Date(`${fechaIso}T00:00:00`);
  if (Number.isNaN(base.getTime())) return null;

  const d = new Date(base);
  d.setMonth(d.getMonth() + m);
  // normalizar a yyyy-mm-dd
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function validarSolicitud(data) {
  const errores = {};
  const requerido = (valor) => String(valor ?? "").trim().length > 0;

  if (!requerido(data?.cotizacion?.productoSeguro))
    errores.productoSeguro = "Seleccioná un producto de seguro.";
  if (!requerido(data?.direccionAsegurado?.primeraLinea))
    errores.primeraLinea = "Ingresá la primera línea de dirección.";
  if (!requerido(data?.direccionAsegurado?.ciudad))
    errores.ciudad = "Ingresá la ciudad.";
  if (!requerido(data?.direccionAsegurado?.paisOperacion))
    errores.paisOperacion = "Seleccioná el país de operación.";
  if (!requerido(data?.periodoSeguro?.fechaInicio))
    errores.fechaInicio = "Elegí la fecha de inicio del período.";

  // Consentimiento opcional mientras la sección no esté visible en el formulario
  // if (!data?.consentimientos?.tratamientoDatos)
  //   errores.tratamientoDatos = "Necesitás aceptar el tratamiento de datos.";

  return errores;
}


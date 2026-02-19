const CLAVE_SESION = "messirve_seguro_sesion";

export function leerSesionSegura() {
  try {
    const bruto = localStorage.getItem(CLAVE_SESION);
    if (!bruto) return null;
    const sesion = JSON.parse(bruto);
    return sesion && typeof sesion === "object" ? sesion : null;
  } catch {
    return null;
  }
}

export function guardarSesionSegura(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion ?? {}));
}

export function cerrarSesionSegura() {
  localStorage.removeItem(CLAVE_SESION);
}

export function obtenerRolDesdeSesion(sesion) {
  // Soporta varios shapes posibles para que no te amarre el guard a un único backend.
  return (
    sesion?.rol ??
    sesion?.role ??
    sesion?.usuario?.rol ??
    sesion?.usuario?.role ??
    sesion?.usuario?.tipoUsuario ??
    null
  );
}

export function isSesionValida(sesion) {
  // Heurística mínima: token/credencial presente.
  const token = sesion?.token ?? sesion?.accessToken ?? sesion?.jwt ?? null;
  return typeof token === "string" ? token.trim().length > 0 : Boolean(token);
}


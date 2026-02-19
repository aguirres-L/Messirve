import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Nota: esto es intencionalmente simple.
// La "seguridad real" debe validarse también en backend; acá solo controlamos UI/routing.
import {
  isSesionValida,
  leerSesionSegura,
  obtenerRolDesdeSesion,
} from "./seguridadSession.js";

function expandirRoles(rol) {
  const base = typeof rol === "string" ? rol : null;
  if (!base) return [];
  if (base === "broker-admin") return ["broker-admin", "broker", "admin"];
  return [base];
}

export function RequireAuth({ rutaLogin = "/admin" }) {
  const ubicacion = useLocation();
  const sesion = leerSesionSegura();

  if (!isSesionValida(sesion)) {
    return (
      <Navigate
        to={rutaLogin}
        replace
        state={{ returnTo: ubicacion.pathname + ubicacion.search }}
      />
    );
  }

  return <Outlet />;
}

export function RequireRole({
  rolesPermitidos,
  rutaSinPermiso = "/admin",
  children,
}) {
  const sesion = leerSesionSegura();
  const rol = obtenerRolDesdeSesion(sesion);

  const lista = Array.isArray(rolesPermitidos) ? rolesPermitidos : [];
  const rolesDelUsuario = expandirRoles(rol);
  const tienePermiso =
    lista.length === 0 ? true : lista.some((r) => rolesDelUsuario.includes(r));

  if (!isSesionValida(sesion)) return <Navigate to="/admin" replace />;
  if (!tienePermiso) return <Navigate to={rutaSinPermiso} replace />;

  return children;
}

export function obtenerRutaInicioPorRol(rol) {
  const destinoPorRol = {
    broker: "/broker",
    admin: "/admin",
    "broker-admin": "/admin",
  };

  return destinoPorRol[rol] ?? "/broker";
}

export function RedirectSiAutenticado({ children, rutaDestino }) {
  const sesion = leerSesionSegura();
  if (!isSesionValida(sesion)) return children;

  const rol = obtenerRolDesdeSesion(sesion);
  const destino =
    typeof rutaDestino === "string" && rutaDestino.trim().length > 0
      ? rutaDestino
      : obtenerRutaInicioPorRol(rol);

  return <Navigate to={destino} replace />;
}

export function RedirectDashboardPorRol() {
  const sesion = leerSesionSegura();
  const rol = obtenerRolDesdeSesion(sesion);
  return <Navigate to={obtenerRutaInicioPorRol(rol)} replace />;
}


import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  guardarSesionSegura,
  obtenerRutaInicioPorRol,
} from "../../router/segurity_Router/seguridadNavigation.js";
import { autenticarCredencialesDemo } from "./login.utils";

export function useLogin() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const returnTo = useMemo(() => {
    const candidato = ubicacion.state?.returnTo;
    return typeof candidato === "string" && candidato.trim().length > 0
      ? candidato
      : null;
  }, [ubicacion.state]);

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isCargando, setIsCargando] = useState(false);
  const [mensajeDeError, setMensajeDeError] = useState(null);

  const isValido = useMemo(() => {
    return correo.trim().length > 3 && contrasena.trim().length > 0;
  }, [correo, contrasena]);

  const onCambiarCorreo = (nuevoCorreo) => {
    setCorreo(nuevoCorreo);
    if (mensajeDeError) setMensajeDeError(null);
  };

  const onCambiarContrasena = (nuevaContrasena) => {
    setContrasena(nuevaContrasena);
    if (mensajeDeError) setMensajeDeError(null);
  };

  const onAutocompletarDemo = (rol) => {
    if (rol === "admin") {
      setCorreo("admin@messirve.com");
      setContrasena("1234");
      return;
    }

    // default: broker
    setCorreo("broker@messirve.com");
    setContrasena("1234");
  };

  const onIngresar = async (evento) => {
    evento?.preventDefault?.();
    if (isCargando) return;

    try {
      setIsCargando(true);
      setMensajeDeError(null);

      const resultado = autenticarCredencialesDemo({ correo, contrasena });
      if (!resultado.ok) {
        setMensajeDeError(resultado.mensajeDeError);
        return;
      }

      guardarSesionSegura({
        token: resultado.token,
        rol: resultado.rol, // "broker" | "admin" | "broker-admin"
        usuario: { correo: resultado.correo, nombre: resultado.nombre },
      });

      const destino = returnTo ?? obtenerRutaInicioPorRol(resultado.rol);
      navegar(destino, { replace: true });
    } catch {
      setMensajeDeError("No se pudo iniciar sesión. Intentalo de nuevo.");
    } finally {
      setIsCargando(false);
    }
  };

  return {
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
  };
}


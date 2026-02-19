import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cerrarSesionSegura,
  guardarSesionSegura,
  isSesionValida,
  leerSesionSegura,
  obtenerRolDesdeSesion,
} from "../../../../router/segurity_Router/seguridadNavigation.js";
import { autenticarAdmin } from "../../../../service/client/client_data.js";

function leerReturnToDesdeUbicacion(ubicacion) {
  const candidato = ubicacion?.state?.returnTo;
  return typeof candidato === "string" && candidato.trim().length > 0
    ? candidato
    : null;
}

export function useLoginClient() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const returnTo = useMemo(() => {
    return leerReturnToDesdeUbicacion(ubicacion);
  }, [ubicacion]);

  const [sesion, setSesion] = useState(() => leerSesionSegura());
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isCargando, setIsCargando] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [mensajeDeError, setMensajeDeError] = useState(null);

  const isSesionActiva = isSesionValida(sesion);
  const rolActual = useMemo(() => obtenerRolDesdeSesion(sesion), [sesion]);
  const correoActual = sesion?.usuario?.correo ?? sesion?.usuario?.email ?? null;

  const isValido = useMemo(() => {
    return correo.trim().length > 3 && contrasena.trim().length > 0;
  }, [correo, contrasena]);

  const limpiarMensajes = () => {
    if (mensajeDeError) setMensajeDeError(null);
  };

  const onCambiarCorreo = (nuevoCorreo) => {
    setCorreo(nuevoCorreo);
    limpiarMensajes();
  };

  const onCambiarContrasena = (nuevaContrasena) => {
    setContrasena(nuevaContrasena);
    limpiarMensajes();
  };

  const onTogglePasswordVisible = () => {
    setIsPasswordVisible((v) => !v);
  };

  const onAutocompletarDemo = (tipo) => {
    if (tipo === "cliente") {
      setCorreo("cliente@gmail.com");
      setContrasena("1234");
      limpiarMensajes();
      return;
    }

    // default: admin
    setCorreo("admin@gmail.com");
    setContrasena("1234");
    limpiarMensajes();
  };

  const onCerrarSesion = () => {
    cerrarSesionSegura();
    setSesion(null);
    navegar("/admin", { replace: true });
  };

  const onIngresar = async (evento) => {
    evento?.preventDefault?.();
    if (isCargando) return;

    try {
      setIsCargando(true);
      setMensajeDeError(null);

      const resultado = await autenticarAdmin(correo, contrasena);

      if (!resultado.ok) {
        setMensajeDeError(resultado.mensajeDeError ?? "Credenciales inválidas.");
        return;
      }

      const rol = resultado.rol;
      const rolesPermitidos = ["cliente", "admin", "broker-admin"];
      const isRolPermitido = rolesPermitidos.includes(rol);
      if (!isRolPermitido) {
        setMensajeDeError(
          "Tu cuenta no tiene permisos para acceder al área de clientes. Si sos broker, ingresá por /broker."
        );
        return;
      }

      guardarSesionSegura({
        token: resultado.token,
        rol: resultado.rol,
        usuario: { correo: resultado.correo, nombre: resultado.nombre },
      });

      const destino = returnTo ?? "/cliente";
      navegar(destino, { replace: true });
    } catch (err) {
      const msg = err?.message ?? "";
      if (msg.includes("permission") || msg.includes("Permission")) {
        setMensajeDeError("Sin permiso para leer credenciales. Revisá que las reglas de Firestore permitan lectura en admin_data.");
      } else {
        setMensajeDeError(msg || "No se pudo iniciar sesión. Intentalo de nuevo.");
      }
    } finally {
      setIsCargando(false);
      setSesion(leerSesionSegura());
    }
  };

  return {
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
  };
}


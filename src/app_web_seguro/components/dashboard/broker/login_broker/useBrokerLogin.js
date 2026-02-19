import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cerrarSesionSegura,
  guardarSesionSegura,
  isSesionValida,
  leerSesionSegura,
  obtenerRolDesdeSesion,
} from "../../../../router/segurity_Router/seguridadNavigation.js";
import { autenticarBroker } from "../../../../service/broker/broker_data.js";

const INTENTOS_MAXIMOS = 5;
const BLOQUEO_MS = 30_000;

function leerReturnToDesdeUbicacion(ubicacion) {
  const candidato = ubicacion?.state?.returnTo;
  return typeof candidato === "string" && candidato.trim().length > 0
    ? candidato
    : null;
}

export function useBrokerLogin() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const returnTo = useMemo(() => {
    return leerReturnToDesdeUbicacion(ubicacion);
  }, [ubicacion]);

  const [sesion, setSesion] = useState(() => leerSesionSegura());
  const [nombreDeBroker, setNombreDeBroker] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isCargando, setIsCargando] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [mensajeDeError, setMensajeDeError] = useState(null);
  const [mensajeDeExito, setMensajeDeExito] = useState(null);

  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueadoHastaMs, setBloqueadoHastaMs] = useState(null);
  const tickRef = useRef(null);
  const [ahoraMs, setAhoraMs] = useState(Date.now());

  const rolActual = useMemo(() => obtenerRolDesdeSesion(sesion), [sesion]);
  const correoActual = sesion?.usuario?.correo ?? sesion?.usuario?.email ?? null;
  const isSesionActiva = isSesionValida(sesion);

  const isValido = useMemo(() => {
    return nombreDeBroker.trim().length >= 3 && contrasena.trim().length > 0;
  }, [nombreDeBroker, contrasena]);

  const isBloqueado = useMemo(() => {
    if (typeof bloqueadoHastaMs !== "number") return false;
    return ahoraMs < bloqueadoHastaMs;
  }, [ahoraMs, bloqueadoHastaMs]);

  const tiempoBloqueoSegundos = useMemo(() => {
    if (!isBloqueado) return 0;
    return Math.max(1, Math.ceil((bloqueadoHastaMs - ahoraMs) / 1000));
  }, [ahoraMs, bloqueadoHastaMs, isBloqueado]);

  useEffect(() => {
    if (!isBloqueado) return;
    tickRef.current = window.setInterval(() => setAhoraMs(Date.now()), 250);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [isBloqueado]);

  const limpiarMensajes = () => {
    if (mensajeDeError) setMensajeDeError(null);
    if (mensajeDeExito) setMensajeDeExito(null);
  };

  const onCambiarNombreDeBroker = (nuevoNombre) => {
    setNombreDeBroker(nuevoNombre);
    limpiarMensajes();
  };

  const onCambiarContrasena = (nuevaContrasena) => {
    setContrasena(nuevaContrasena);
    limpiarMensajes();
  };

  const onTogglePasswordVisible = () => {
    setIsPasswordVisible((v) => !v);
  };

  const onCerrarSesion = () => {
    cerrarSesionSegura();
    setSesion(null);
    navegar("/broker", { replace: true });
  };

  const onIngresar = async (evento) => {
    evento?.preventDefault?.();
    if (isCargando) return;

    if (isBloqueado) {
      setMensajeDeError(
        `Demasiados intentos. Esperá ${tiempoBloqueoSegundos}s y volvé a intentar.`
      );
      return;
    }

    try {
      setIsCargando(true);
      setMensajeDeError(null);
      setMensajeDeExito(null);

      const resultado = await autenticarBroker(nombreDeBroker, contrasena);

      if (!resultado.ok) {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= INTENTOS_MAXIMOS) {
          const hasta = Date.now() + BLOQUEO_MS;
          setBloqueadoHastaMs(hasta);
          setAhoraMs(Date.now());
          setMensajeDeError(
            `Acceso temporalmente bloqueado por seguridad. Intentá nuevamente en ${Math.ceil(
              BLOQUEO_MS / 1000
            )}s.`
          );
          return;
        }

        setMensajeDeError("Credenciales inválidas. Verificá tus datos e intentá nuevamente.");
        return;
      }

      const rol = resultado.rol;
      const rolesPermitidos = ["broker", "broker-admin", "admin"];
      const isRolPermitido = rolesPermitidos.includes(rol);
      if (!isRolPermitido) {
        setMensajeDeError(
          "Tu cuenta no tiene permisos para acceder al área broker. Si sos cliente, ingresá por /admin."
        );
        return;
      }

      guardarSesionSegura({
        token: resultado.token,
        rol: resultado.rol,
        usuario: { correo: resultado.correo, nombre: resultado.nombre },
      });

      setSesion(leerSesionSegura());
      setMensajeDeExito("Acceso verificado. Sesión iniciada.");
      setIntentosFallidos(0);
      setBloqueadoHastaMs(null);

      const destino = returnTo ?? "/broker/formulario";
      navegar(destino, { replace: true });
    } catch {
      setMensajeDeError("No se pudo iniciar sesión. Intentalo de nuevo.");
    } finally {
      setIsCargando(false);
    }
  };

  return {
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
  };
}


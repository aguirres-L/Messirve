import { useEffect, useMemo, useState } from "react";
import { listarJuegosRawg, obtenerJuegoRawgPorId } from "../../../../../service/rawg/index.js";
import { mapearRawgDetalleAUi } from "./rawg-ui.mapper.js";

const pcUsuarioInicial = {
  cpu: "",
  gpu: "",
  ramGb: 16,
  vramGb: 8,
  almacenamientoLibreGb: 100,
  os: "Windows 10",
  directX: "12",
  notas: "",
};

function normalizarNumero(valor, fallback) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : fallback;
}

export function useGamePcCompare() {
  const [listaDeJuegos, setListaDeJuegos] = useState([]);
  const [juegoIdSeleccionado, setJuegoIdSeleccionado] = useState(0);
  const [rawgDetalle, setRawgDetalle] = useState(null);
  const [isCargandoRawg, setIsCargandoRawg] = useState(false);
  const [errorRawg, setErrorRawg] = useState("");
  const [pcUsuario, setPcUsuario] = useState(pcUsuarioInicial);
  const [isCopiando, setIsCopiando] = useState(false);
  const [mensajeCopia, setMensajeCopia] = useState("");

  const juegoUi = useMemo(() => (rawgDetalle ? mapearRawgDetalleAUi(rawgDetalle) : null), [rawgDetalle]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setIsCargandoRawg(true);
        setErrorRawg("");
        const data = await listarJuegosRawg({ pageSize: 25, ordering: "-added", signal: controller.signal });
        const juegos = (data?.results ?? []).map((juego) => ({ id: juego.id, nombre: juego.name }));
        setListaDeJuegos(juegos);
        setJuegoIdSeleccionado((prev) => prev || juegos[0]?.id || 0);
      } catch (e) {
        if (controller.signal.aborted) return;
        setErrorRawg(e?.message || "No se pudo cargar RAWG.");
      } finally {
        if (!controller.signal.aborted) setIsCargandoRawg(false);
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!juegoIdSeleccionado) {
      setRawgDetalle(null);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        setIsCargandoRawg(true);
        setErrorRawg("");
        const detalle = await obtenerJuegoRawgPorId({ juegoId: juegoIdSeleccionado, signal: controller.signal });
        setRawgDetalle(detalle ?? null);
      } catch (e) {
        if (controller.signal.aborted) return;
        setErrorRawg(e?.message || "No se pudo cargar el detalle del juego.");
      } finally {
        if (!controller.signal.aborted) setIsCargandoRawg(false);
      }
    })();

    return () => controller.abort();
  }, [juegoIdSeleccionado]);

  const jsonParaGemini = useMemo(() => {
    const payload = {
      juego: rawgDetalle
        ? {
            id: rawgDetalle.id,
            nombre: rawgDetalle.name,
            slug: rawgDetalle.slug,
            fechaLanzamiento: rawgDetalle.released ?? null,
            metacritic: rawgDetalle.metacritic ?? null,
            rating: rawgDetalle.rating ?? null,
            generos: (rawgDetalle.genres ?? []).map((g) => g.name),
            plataformas: (rawgDetalle.platforms ?? []).map((p) => p.platform?.name).filter(Boolean),
            requisitosPcDesdeRawg: (rawgDetalle.platforms ?? [])
              .find((p) => p.platform?.slug === "pc")
              ?.requirements_en ?? null,
            nota:
              "Los requisitos pueden venir en texto libre; el modelo debe inferir comparaciones aproximadas (CPU/GPU/RAM/OS/Storage).",
          }
        : null,
      pcUsuario: {
        cpu: pcUsuario.cpu,
        gpu: pcUsuario.gpu,
        ramGb: pcUsuario.ramGb,
        vramGb: pcUsuario.vramGb,
        almacenamientoLibreGb: pcUsuario.almacenamientoLibreGb,
        os: pcUsuario.os,
        directX: pcUsuario.directX,
        notas: pcUsuario.notas,
      },
      objetivo:
        "Determinar si la PC del usuario puede correr el juego (mínimo/recomendado) y dar una explicación breve + sugerencias de upgrade si aplica.",
      salidaEsperada: {
        puedeCorrerMinimo: "boolean",
        puedeCorrerRecomendado: "boolean",
        confianza: "0-1",
        resumen: "string",
        cuellosDeBotella: "string[]",
        recomendacionesUpgrade: "string[]",
      },
    };

    return JSON.stringify(payload, null, 2);
  }, [pcUsuario, rawgDetalle]);

  const onCambiarJuegoId = (nuevoId) => {
    setJuegoIdSeleccionado(normalizarNumero(nuevoId, listaDeJuegos[0]?.id ?? 0));
    setMensajeCopia("");
  };

  const onCambiarPcCampo = (campo, valor) => {
    setPcUsuario((prev) => {
      if (campo === "ramGb" || campo === "vramGb" || campo === "almacenamientoLibreGb") {
        return { ...prev, [campo]: normalizarNumero(valor, prev[campo]) };
      }
      return { ...prev, [campo]: valor };
    });
    setMensajeCopia("");
  };

  const onCopiarJson = async () => {
    try {
      setIsCopiando(true);
      setMensajeCopia("");
      await navigator.clipboard.writeText(jsonParaGemini);
      setMensajeCopia("JSON copiado al portapapeles.");
    } catch {
      setMensajeCopia("No se pudo copiar. Probá copiar manualmente desde el recuadro.");
    } finally {
      setIsCopiando(false);
    }
  };

  return {
    listaDeJuegos,
    rawgDetalle,
    juegoUi,
    pcUsuario,
    jsonParaGemini,
    isCopiando,
    mensajeCopia,
    isCargandoRawg,
    errorRawg,
    onCambiarJuegoId,
    onCambiarPcCampo,
    onCopiarJson,
  };
}


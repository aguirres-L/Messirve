import { useEffect, useMemo, useState } from "react";
import { getBienes } from "../../../service/bienes/bienes_data.js";
import { getBrokers } from "../../../service/broker/broker_data.js";

/**
 * Normaliza un documento de bienes_data para mostrar en lista (título, subtítulo, broker).
 */
function bienParaLista(bien) {
  const asegurado = bien?.cotizacion?.aseguradoOriginal?.trim() || "Sin asegurado";
  const producto = bien?.cotizacion?.productoSeguro === "aviacion-general" ? "Aviación general" : bien?.cotizacion?.productoSeguro || "—";
  const brokerNombre = bien?.broker?.nombre || bien?.broker?.correo || "—";
  const primeraAeronave = Array.isArray(bien?.flotaLista) && bien.flotaLista[0];
  const ubicacion = bien?.direccionAsegurado?.ciudad && bien?.direccionAsegurado?.paisOperacion
    ? `${bien.direccionAsegurado.ciudad}, ${bien.direccionAsegurado.paisOperacion}`
    : bien?.direccionAsegurado?.paisOperacion || "—";
  return {
    ...bien,
    _titulo: asegurado,
    _producto: producto,
    _brokerNombre: brokerNombre,
    _ubicacion: ubicacion,
    _primeraMatricula: primeraAeronave?.matricula || "—",
  };
}

/**
 * Suma valor acordado de flotaLista en un bien (numérico).
 */
function sumarValorFlota(bien) {
  if (!Array.isArray(bien?.flotaLista)) return 0;
  return bien.flotaLista.reduce((acc, a) => acc + (Number(a?.valorAcordado) || 0), 0);
}

export function useClientDashboard() {
  const [bienesRaw, setBienesRaw] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [isCargando, setIsCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [idBienSeleccionado, setIdBienSeleccionado] = useState(null);
  const [textoFiltro, setTextoFiltro] = useState("");

  useEffect(() => {
    let cancelado = false;
    setErrorCarga(null);
    setIsCargando(true);

    Promise.all([getBienes(), getBrokers()])
      .then(([listaBienes, listaBrokers]) => {
        if (cancelado) return;
        setBienesRaw(listaBienes ?? []);
        setBrokers(listaBrokers ?? []);
        if (listaBienes?.length && !idBienSeleccionado) {
          setIdBienSeleccionado(listaBienes[0].id);
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setErrorCarga(err?.message ?? "Error al cargar datos.");
        }
      })
      .finally(() => {
        if (!cancelado) setIsCargando(false);
      });

    return () => { cancelado = true; };
  }, []);

  const bienesParaLista = useMemo(() => bienesRaw.map(bienParaLista), [bienesRaw]);

  const bienesFiltrados = useMemo(() => {
    const q = textoFiltro.trim().toLowerCase();
    if (!q) return bienesParaLista;
    return bienesParaLista.filter((bien) => {
      const texto = `${bien._titulo} ${bien._producto} ${bien._brokerNombre} ${bien._ubicacion} ${bien._primeraMatricula}`.toLowerCase();
      return texto.includes(q);
    });
  }, [bienesParaLista, textoFiltro]);

  const bienSeleccionado = useMemo(() => {
    if (!idBienSeleccionado) return null;
    const encontrado = bienesRaw.find((b) => b.id === idBienSeleccionado);
    return encontrado ? bienParaLista(encontrado) : null;
  }, [bienesRaw, idBienSeleccionado]);

  const onSeleccionarBien = (id) => setIdBienSeleccionado(id);
  const onCambiarFiltro = (valor) => setTextoFiltro(valor);

  const resumen = useMemo(() => {
    const total = bienesRaw.length;
    const totalUsd = bienesRaw.reduce((acc, b) => acc + sumarValorFlota(b), 0);
    return { totalUsd, activos: total, total };
  }, [bienesRaw]);

  const datosEstado = useMemo(() => {
    const contador = new Map();
    bienesParaLista.forEach((b) => {
      const key = b._producto || "Otros";
      contador.set(key, (contador.get(key) ?? 0) + 1);
    });
    return Array.from(contador.entries()).map(([estado, cantidad]) => ({ estado, cantidad }));
  }, [bienesParaLista]);

  const datosValorPorTipo = useMemo(() => {
    const sumas = new Map();
    bienesRaw.forEach((b) => {
      const tipo = b?.cotizacion?.productoSeguro === "aviacion-general" ? "Aviación general" : (b?.cotizacion?.productoSeguro || "Otros");
      const valor = sumarValorFlota(b);
      sumas.set(tipo, (sumas.get(tipo) ?? 0) + valor);
    });
    return Array.from(sumas.entries())
      .map(([tipo, valorUsd]) => ({ tipo, valorUsd }))
      .sort((a, b) => b.valorUsd - a.valorUsd);
  }, [bienesRaw]);

  const brokersSinPassword = useMemo(
    () => brokers.map((b) => ({ id: b.id, name: b.name ?? "—", email: b.email ?? "—" })),
    [brokers]
  );

  return {
    bienesTotales: bienesParaLista,
    bienes: bienesFiltrados,
    bienSeleccionado,
    textoFiltro,
    resumen,
    onCambiarFiltro,
    onSeleccionarBien,
    isCargando,
    errorCarga,
    datosEstado,
    datosValorPorTipo,
    brokers: brokersSinPassword,
  };
}

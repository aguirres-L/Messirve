import { useEffect, useMemo, useState } from "react";
import { crearBien } from "../../../../service/bienes/bienes_data.js";
import {
  guardarBorradorBroker,
  leerBorradorBroker,
  limpiarBorradorBroker,
  sumarMeses,
  validarSolicitud,
} from "./brokerFormulario.utils";

function hoyIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const initial = {
  // Nueva cotización (imagen 1)
  cotizacion: {
    productoSeguro: "aviacion-general",
    paisAseguradoOriginal: "",
    aseguradoOriginal: "",
  },
  // Dirección del asegurado (imagen 2)
  direccionAsegurado: {
    primeraLinea: "",
    segundaLinea: "",
    ciudad: "",
    estadoCondado: "",
    codigoPostal: "",
    paisOperacion: "",
  },
  // Intermediarios (imagen 2)
  intermediarios: {
    referenciaBrokerUmr: "",
    contacto: "",
  },
  // Método de colocación (imagen 2)
  metodoColocacion: {
    metodo: "",
  },
  // Detalles de flota - toggle y lista (imagen 2 y 3)
  flota: {
    ingresarNuevaAeronave: false,
  },
  flotaDetalle: {
    tipoAla: "ala-fija",
    matricula: "",
    tipoAeronave: "",
    anioFabricacion: "",
    asientosPasajeros: "",
    asientosTripulacion: "",
    monedaValor: "USD",
    valorAcordado: "",
    usosAeronave: "",
    garantiaPilotoAbierto: "",
    agregarGarantiaCopiloto: "no",
    utilizacionAnual: "",
    coberturaFullFlightGro: "",
  },
  flotaLista: [],
  // Accidente personal, período, límites, pilotos (imagen 4)
  accidentePersonal: {
    incluir: "no",
  },
  periodoSeguro: {
    fechaInicio: hoyIso(),
  },
  limitesResponsabilidad: {
    moneda: "USD",
    incluirPilotosTripulacion: "no",
    limiteUnicoCombinado: "",
  },
  pilotosNombrados: {
    agregarPilotos: false,
  },
  pilotosLista: [],
  // Bonificación no reclamaciones, experiencia, impuestos, deducciones (imagen 5)
  noClaimsBonus: {
    valor: "Ninguno",
  },
  experiencia: {
    perdidasUltimos3Anios: "no",
    anosOperacionAeronaves: "",
  },
  impuestosAplicables: [],
  deducciones: {
    comisionTotalPorcentaje: 0,
  },
  // Legado / extra
  archivos: { nombres: [] },
  consentimientos: {
    tratamientoDatos: false,
    contactoComercial: false,
  },
};

export function useBrokerFormulario({ correoBroker, nombreBroker }) {
  const broker = { correo: correoBroker ?? null, nombre: nombreBroker ?? null };
  const [data, setData] = useState(() => {
    const borrador = leerBorradorBroker();
    const base = borrador ? { ...initial, ...borrador } : initial;
    const nombre = (nombreBroker ?? "").trim();
    const correo = (correoBroker ?? "").trim();
    const contactoVacio = !(base.intermediarios?.contacto ?? "").trim();
    const referenciaVacia = !(base.intermediarios?.referenciaBrokerUmr ?? "").trim();
    if ((nombre || correo) && (contactoVacio || referenciaVacia)) {
      return {
        ...base,
        intermediarios: {
          ...base.intermediarios,
          contacto: nombre || correo,
          referenciaBrokerUmr: correo || (base.intermediarios?.referenciaBrokerUmr ?? ""),
        },
      };
    }
    return base;
  });
  const [errores, setErrores] = useState({});
  const [isEnviando, setIsEnviando] = useState(false);
  const [mensajeOk, setMensajeOk] = useState(null);

  const finVigencia = useMemo(() => {
    return sumarMeses(data.periodoSeguro?.fechaInicio, "12");
  }, [data.periodoSeguro?.fechaInicio]);

  useEffect(() => {
    if (!mensajeOk) return;
    const t = window.setTimeout(() => setMensajeOk(null), 5000);
    return () => window.clearTimeout(t);
  }, [mensajeOk]);

  const onChange = (ruta, valor) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const [a, b] = ruta.split(".");
      next[a][b] = valor;
      return next;
    });
    if (Object.keys(errores).length) setErrores({});
  };

  const onToggle = (ruta) => {
    setData((prev) => {
      const next = structuredClone(prev);
      const [a, b] = ruta.split(".");
      next[a][b] = !Boolean(next[a][b]);
      return next;
    });
    if (Object.keys(errores).length) setErrores({});
  };

  const onArchivos = (fileList) => {
    const nombres = Array.from(fileList ?? []).map((f) => f.name);
    setData((prev) => ({ ...prev, archivos: { nombres } }));
  };

  const onAgregarAeronave = () => {
    setData((prev) => ({
      ...prev,
      flotaLista: [...(prev.flotaLista ?? []), { ...prev.flotaDetalle }],
      flotaDetalle: { ...initial.flotaDetalle },
    }));
  };

  const onGuardarBorrador = () => {
    guardarBorradorBroker({ ...data, broker });
    setMensajeOk("Borrador guardado en tu navegador.");
  };

  const onLimpiar = () => {
    limpiarBorradorBroker();
    setData(initial);
    setErrores({});
    setMensajeOk("Formulario reiniciado.");
  };

  const onEnviar = async (evento) => {
    evento?.preventDefault?.();
    if (isEnviando) return;

    const e = validarSolicitud(data);
    if (Object.keys(e).length) {
      setErrores(e);
      return;
    }

    try {
      setIsEnviando(true);
      setErrores({});
      setMensajeOk(null);

      const payload = { ...data, broker };
      const resultado = await crearBien(payload);

      if (!resultado.ok) {
        setMensajeOk(null);
        setErrores({ envio: resultado.error });
        return;
      }

      guardarBorradorBroker(payload);
      setMensajeOk("Solicitud enviada correctamente. Nº de registro: " + resultado.id + ".");
    } catch (err) {
      setMensajeOk(null);
      setErrores({ envio: err?.message ?? "Error al enviar la solicitud." });
    } finally {
      setIsEnviando(false);
    }
  };

  const onCalcularPrima = () => {
    guardarBorradorBroker({ ...data, broker });
    setMensajeOk("Cálculo de prima solicitado (simulación). Revisá el borrador guardado.");
  };

  return {
    data,
    errores,
    isEnviando,
    mensajeOk,
    finVigencia,
    onChange,
    onToggle,
    onArchivos,
    onGuardarBorrador,
    onLimpiar,
    onEnviar,
    onAgregarAeronave,
    onCalcularPrima,
  };
}


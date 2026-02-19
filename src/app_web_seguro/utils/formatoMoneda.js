/**
 * Formatea un valor numérico en USD de forma legible.
 * Números grandes se muestran en formato corto (K, M, B) para no saturar la UI.
 * @param {number} valor - Valor numérico (puede ser string desde Firestore).
 * @param {{ compacto?: boolean, moneda?: string }} opciones - compacto: usar K/M/B; moneda: sufijo (USD por defecto).
 * @returns {string} Ej: "$1.2 M USD", "$350" o "—"
 */
export function formatoMoneda(valor, opciones = {}) {
  const { compacto = true, moneda = "USD" } = opciones;
  const num = Number(valor);
  if (num === 0 || Number.isNaN(num)) return "—";
  const abs = Math.abs(num);

  if (!compacto || abs < 10000) {
    return `$${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(num)} ${moneda}`.trim();
  }

  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
  if (abs >= 1e12) return `$${formatter.format(num / 1e12)} B ${moneda}`;
  if (abs >= 1e9) return `$${formatter.format(num / 1e9)} B ${moneda}`;
  if (abs >= 1e6) return `$${formatter.format(num / 1e6)} M ${moneda}`;
  if (abs >= 1e3) return `$${formatter.format(num / 1e3)} K ${moneda}`;
  return `$${formatter.format(num)} ${moneda}`;
}

/**
 * Formato corto solo para etiquetas (ej. ejes de gráficos): "$1.2M", "$50k".
 */
export function formatoMonedaCorto(valor) {
  const num = Number(valor);
  if (num === 0 || Number.isNaN(num)) return "$0";
  const abs = Math.abs(num);
  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  if (abs >= 1e12) return `$${formatter.format(num / 1e12)}B`;
  if (abs >= 1e9) return `$${formatter.format(num / 1e9)}B`;
  if (abs >= 1e6) return `$${formatter.format(num / 1e6)}M`;
  if (abs >= 1e3) return `$${formatter.format(num / 1e3)}k`;
  return `$${formatter.format(num)}`;
}

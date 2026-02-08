function normalizarRequisitos(requisitos) {
  if (!requisitos) return null
  if (typeof requisitos === "string") {
    return { minimum: requisitos, recommended: "" }
  }
  return {
    minimum: requisitos.minimum ?? "",
    recommended: requisitos.recommended ?? "",
  }
}

export function mapearRawgDetalleAUi(rawgDetalle) {
  const generos = (rawgDetalle?.genres ?? []).map((g) => g.name)
  const plataformas = (rawgDetalle?.platforms ?? []).map((p) => p.platform?.name).filter(Boolean)

  const plataformaPc = (rawgDetalle?.platforms ?? []).find((p) => p.platform?.slug === "pc")
  const requisitosEn = normalizarRequisitos(plataformaPc?.requirements_en ?? null)
  const requisitos = requisitosEn

  return {
    id: rawgDetalle?.id ?? 0,
    nombre: rawgDetalle?.name ?? "Juego",
    slug: rawgDetalle?.slug ?? "",
    fechaLanzamiento: rawgDetalle?.released ?? null,
    imagenUrl: rawgDetalle?.background_image ?? null,
    metacritic: rawgDetalle?.metacritic ?? null,
    rating: rawgDetalle?.rating ?? null,
    cantidadDeRatings: rawgDetalle?.ratings_count ?? null,
    descripcion: rawgDetalle?.description_raw ?? "",
    website: rawgDetalle?.website ?? "",
    redditUrl: rawgDetalle?.reddit_url ?? "",
    generos,
    plataformas,
    requisitosPc: requisitos
      ? {
          minimo: requisitos.minimum ?? "",
          recomendado: requisitos.recommended ?? "",
        }
      : null,
  }
}


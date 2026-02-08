export const rawgListaDeJuegosMock = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 3498,
      slug: "grand-theft-auto-v",
      name: "Grand Theft Auto V",
      released: "2013-09-17",
      background_image: "https://example.com/gta5.jpg",
      rating: 4.48,
      rating_top: 5,
      ratings_count: 6800,
      metacritic: 92,
      genres: [
        { id: 4, name: "Action", slug: "action" },
        { id: 3, name: "Adventure", slug: "adventure" },
      ],
      platforms: [
        { platform: { id: 4, name: "PC", slug: "pc" } },
        { platform: { id: 187, name: "PlayStation 5", slug: "playstation5" } },
      ],
      short_screenshots: [
        { id: 10, image: "https://example.com/ss1.jpg" },
        { id: 11, image: "https://example.com/ss2.jpg" },
      ],
    },
    {
      id: 4200,
      slug: "portal-2",
      name: "Portal 2",
      released: "2011-04-18",
      background_image: "https://example.com/portal2.jpg",
      rating: 4.62,
      rating_top: 5,
      ratings_count: 5200,
      metacritic: 95,
      genres: [{ id: 7, name: "Puzzle", slug: "puzzle" }],
      platforms: [{ platform: { id: 4, name: "PC", slug: "pc" } }],
      short_screenshots: [],
    },
  ],
};

export const rawgDetalleDeJuegoMockPorId = {
  3498: {
    id: 3498,
    slug: "grand-theft-auto-v",
    name: "Grand Theft Auto V",
    released: "2013-09-17",
    background_image: "https://example.com/gta5.jpg",
    metacritic: 92,
    rating: 4.48,
    ratings_count: 6800,
    description_raw: "Juego de mundo abierto con historia y modo online.",
    website: "https://www.rockstargames.com/V/",
    reddit_url: "https://www.reddit.com/r/GrandTheftAutoV/",
    genres: [
      { id: 4, name: "Action", slug: "action" },
      { id: 3, name: "Adventure", slug: "adventure" },
    ],
    platforms: [
      {
        platform: { id: 4, name: "PC", slug: "pc" },
        requirements_en: {
          minimum:
            "OS: Windows 10 | CPU: Intel Core 2 Quad Q6600 | RAM: 4 GB | GPU: NVIDIA 9800 GT 1GB | Storage: 72 GB",
          recommended:
            "OS: Windows 10 | CPU: Intel Core i5 3470 | RAM: 8 GB | GPU: NVIDIA GTX 660 2GB | Storage: 72 GB",
        },
      },
      {
        platform: { id: 187, name: "PlayStation 5", slug: "playstation5" },
        requirements_en: null,
      },
    ],
    developers: [{ id: 3524, name: "Rockstar North", slug: "rockstar-north" }],
    publishers: [{ id: 2155, name: "Rockstar Games", slug: "rockstar-games" }],
    tags: [{ id: 31, name: "Singleplayer", slug: "singleplayer" }],
    esrb_rating: { id: 4, name: "Mature", slug: "mature" },
  },
  4200: {
    id: 4200,
    slug: "portal-2",
    name: "Portal 2",
    released: "2011-04-18",
    background_image: "https://example.com/portal2.jpg",
    metacritic: 95,
    rating: 4.62,
    ratings_count: 5200,
    description_raw: "Puzzle en primera persona con historia cooperativa.",
    website: "https://www.thinkwithportals.com/",
    reddit_url: "https://www.reddit.com/r/Portal/",
    genres: [{ id: 7, name: "Puzzle", slug: "puzzle" }],
    platforms: [
      {
        platform: { id: 4, name: "PC", slug: "pc" },
        requirements_en: {
          minimum:
            "OS: Windows 7 | CPU: Dual core 2.0 GHz | RAM: 2 GB | GPU: DirectX 9 compatible | Storage: 8 GB",
          recommended:
            "OS: Windows 10 | CPU: Dual core 3.0 GHz | RAM: 4 GB | GPU: DirectX 11 compatible | Storage: 8 GB",
        },
      },
    ],
    developers: [{ id: 2, name: "Valve", slug: "valve" }],
    publishers: [{ id: 2, name: "Valve", slug: "valve" }],
    tags: [
      { id: 31, name: "Singleplayer", slug: "singleplayer" },
      { id: 7, name: "Co-op", slug: "co-op" },
    ],
    esrb_rating: { id: 2, name: "Everyone 10+", slug: "everyone-10-plus" },
  },
};

export function mapearRawgDetalleAUi(rawgDetalle) {
  const generos = (rawgDetalle?.genres ?? []).map((g) => g.name);
  const plataformas = (rawgDetalle?.platforms ?? []).map((p) => p.platform?.name).filter(Boolean);

  const plataformaPc = (rawgDetalle?.platforms ?? []).find((p) => p.platform?.slug === "pc");
  const requisitos = plataformaPc?.requirements_en ?? null;

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
  };
}


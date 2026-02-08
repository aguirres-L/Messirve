import HeaderComponent from "../home/component_home/Header.jsx"
import { Link } from "react-router-dom"

export default function RawgComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <HeaderComponent />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold">RAWG</h1>
            <p className="text-sm text-white/70">
              Sección informativa sobre la integración de RAWG en Messirve, con atribución obligatoria y buenas
              prácticas de uso.
            </p>
          </header>

          <section
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"
            aria-label="Atribución obligatoria de RAWG"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Atribución</h2>
                <p className="text-sm text-white/80">
                  Los datos e imágenes mostrados en esta sección provienen de{" "}
                  <a
                    href="https://rawg.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline underline-offset-4 hover:text-white/90"
                  >
                    RAWG.io
                  </a>
                  .
                </p>
                <p className="text-xs text-white/60">
                  RAWG es un servicio de terceros. Messirve no está afiliado ni respaldado por RAWG.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://rawg.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-black px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/5"
                >
                  Visitar RAWG
                </a>
                <a
                  href="https://rawg.io/apidocs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-black px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/5"
                >
                  API Docs
                </a>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Información general y uso en Messirve">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-base font-semibold">¿Qué es RAWG?</h2>
              <p className="mt-2 text-sm text-white/80">
                RAWG es una base de datos de videojuegos que expone información como fichas de juegos, géneros,
                plataformas, fechas de lanzamiento y recursos visuales. Messirve usa RAWG como fuente para enriquecer
                la búsqueda y la presentación de datos.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-base font-semibold">¿Cómo lo usa Messirve?</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                <li>Búsqueda y descubrimiento de juegos (título, género, tags, plataformas).</li>
                <li>Ficha informativa (metadatos, imágenes/capturas cuando correspondan).</li>
                <li>Base de referencia para orientar compatibilidad con componentes de PC.</li>
              </ul>
              <p className="mt-2 text-xs text-white/60">
                La compatibilidad final depende del hardware del usuario y de la información disponible por juego.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5" aria-label="Restricciones de uso">
            <h2 className="text-base font-semibold">Uso responsable y restricciones</h2>
            <p className="mt-2 text-sm text-white/80">
              Para cumplir con los términos de la API y evitar usos indebidos:
            </p>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              <li className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-sm font-semibold">No Cloning</div>
                <div className="mt-1 text-sm text-white/70">
                  Messirve no busca replicar RAWG ni ofrecer una copia directa de su plataforma.
                </div>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-sm font-semibold">No reventa de datos</div>
                <div className="mt-1 text-sm text-white/70">
                  No vendemos datos de RAWG de forma aislada; se usan integrados a la experiencia del producto.
                </div>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-sm font-semibold">Uso ético</div>
                <div className="mt-1 text-sm text-white/70">
                  No se utiliza contenido para fines ofensivos, pornográficos o difamatorios.
                </div>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-sm font-semibold">Atribución visible</div>
                <div className="mt-1 text-sm text-white/70">
                  Se mantiene un enlace activo a RAWG.io en cada pantalla donde se muestran datos o imágenes de RAWG.
                </div>
              </li>
            </ul>
          </section>

          <div className="mt-8">
            <Link to="/" className="text-sm font-medium text-white/80 hover:text-white">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

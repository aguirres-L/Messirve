function Chip({ texto }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
      {texto}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-white/70">{label}</span>
      {children}
    </label>
  );
}

export default function GamePcCompare({
  listaDeJuegos,
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
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Comparador Juego vs PC</h1>
          <p className="text-sm text-white/70">
            Datos del juego desde{" "}
            <a
              href="https://rawg.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline underline-offset-4 hover:text-white/90"
            >
              RAWG.io
            </a>{" "}
            + componentes de tu PC para generar un JSON listo para Gemini.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <Field label="Juego (RAWG)">
            <select
              className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              value={juegoUi?.id ?? ""}
              onChange={(e) => onCambiarJuegoId(e.target.value)}
              disabled={isCargandoRawg || listaDeJuegos.length === 0}
            >
              {listaDeJuegos.map((juego) => (
                <option key={juego.id} value={juego.id}>
                  {juego.nombre}
                </option>
              ))}
            </select>
            {errorRawg ? <p className="mt-2 text-xs text-red-300">{errorRawg}</p> : null}
            {isCargandoRawg ? <p className="mt-2 text-xs text-white/60">Cargando datos desde RAWG…</p> : null}
          </Field>
        </div>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white">Ficha del juego</h2>

          {!juegoUi ? (
            <p className="mt-3 text-sm text-white/70">No hay juego seleccionado.</p>
          ) : (
            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                  {juegoUi.imagenUrl ? (
                    <img
                      src={juegoUi.imagenUrl}
                      alt={juegoUi.nombre}
                      className="h-[140px] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-[140px] items-center justify-center text-xs text-white/50">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-lg font-semibold text-white">{juegoUi.nombre}</div>
                    <div className="text-xs text-white/60">
                      Lanzamiento: {juegoUi.fechaLanzamiento ?? "N/D"} · Metacritic:{" "}
                      {juegoUi.metacritic ?? "N/D"} · Rating: {juegoUi.rating ?? "N/D"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {juegoUi.generos.map((g) => (
                      <Chip key={g} texto={g} />
                    ))}
                    {juegoUi.plataformas.map((p) => (
                      <Chip key={p} texto={p} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-semibold text-white/90">Descripción</div>
                <p className="text-sm text-white/75">{juegoUi.descripcion || "Sin descripción."}</p>
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-semibold text-white/90">Requisitos PC (texto)</div>
                {juegoUi.requisitosPc ? (
                  <div className="grid gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                      <div className="text-xs font-semibold text-white/70">Mínimo</div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{juegoUi.requisitosPc.minimo}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                      <div className="text-xs font-semibold text-white/70">Recomendado</div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">
                        {juegoUi.requisitosPc.recomendado}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/70">RAWG no trae requisitos PC para este juego (en el mock).</p>
                )}
              </div>
            </div>
          )}
        </article>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white">Componentes de tu PC</h2>
          <p className="mt-2 text-sm text-white/70">
            Completá lo básico. Esto se usará para construir el JSON que le mandás a Gemini.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="CPU (modelo)">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.cpu}
                onChange={(e) => onCambiarPcCampo("cpu", e.target.value)}
                placeholder="Ej: Ryzen 5 5600 / i5-10400F"
              />
            </Field>

            <Field label="GPU (modelo)">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.gpu}
                onChange={(e) => onCambiarPcCampo("gpu", e.target.value)}
                placeholder="Ej: RTX 3060 / RX 6600"
              />
            </Field>

            <Field label="RAM (GB)">
              <input
                type="number"
                min="1"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.ramGb}
                onChange={(e) => onCambiarPcCampo("ramGb", e.target.value)}
              />
            </Field>

            <Field label="VRAM (GB)">
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.vramGb}
                onChange={(e) => onCambiarPcCampo("vramGb", e.target.value)}
              />
            </Field>

            <Field label="Almacenamiento libre (GB)">
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.almacenamientoLibreGb}
                onChange={(e) => onCambiarPcCampo("almacenamientoLibreGb", e.target.value)}
              />
            </Field>

            <Field label="OS">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.os}
                onChange={(e) => onCambiarPcCampo("os", e.target.value)}
                placeholder="Ej: Windows 10 / Windows 11"
              />
            </Field>

            <Field label="DirectX">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.directX}
                onChange={(e) => onCambiarPcCampo("directX", e.target.value)}
                placeholder="Ej: 11 / 12"
              />
            </Field>

            <Field label="Notas (opcional)">
              <input
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                value={pcUsuario.notas}
                onChange={(e) => onCambiarPcCampo("notas", e.target.value)}
                placeholder="Ej: juego a 1080p, 60fps, etc."
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onCopiarJson}
              disabled={isCopiando}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-black px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 disabled:opacity-60"
            >
              {isCopiando ? "Copiando..." : "Copiar JSON para Gemini"}
            </button>
            {mensajeCopia ? <span className="text-xs text-white/70">{mensajeCopia}</span> : null}
          </div>

         {/*  <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs font-semibold text-white/70">JSON (listo para prompt)</div>
            <pre className="mt-2 max-h-[360px] overflow-auto whitespace-pre-wrap break-words text-xs text-white/80">
              {jsonParaGemini}
            </pre>
          </div> */}

          <p className="mt-3 text-xs text-white/50">
            Tip: cuando conectes RAWG real, vas a reemplazar el mock y mantener la misma estructura de JSON.
          </p>
        </aside>
      </div>
    </section>
  );
}


import GamePcCompare from "./GamePcCompare.jsx";
import { useGamePcCompare } from "./useGamePcCompare.js";

export default function ContainerComponent() {
  const {
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
  } = useGamePcCompare();

  return (
    <main className="flex-1 bg-black text-white">
      <GamePcCompare
        listaDeJuegos={listaDeJuegos}
        juegoUi={juegoUi}
        pcUsuario={pcUsuario}
        jsonParaGemini={jsonParaGemini}
        isCopiando={isCopiando}
        mensajeCopia={mensajeCopia}
        isCargandoRawg={isCargandoRawg}
        errorRawg={errorRawg}
        onCambiarJuegoId={onCambiarJuegoId}
        onCambiarPcCampo={onCambiarPcCampo}
        onCopiarJson={onCopiarJson}
      />
    </main>
  );
}
import { AosInit } from "./components/hooks_components/UseAOS.jsx";
import RouterSeguro from "./app_web_seguro/router/RouterSeguro.jsx";

function App() {
  return (
    <>
      <AosInit configuracion={{ once: true }} />
      <RouterSeguro />
    </>
  );
}

export default App;

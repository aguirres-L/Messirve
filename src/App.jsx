import RouterMessirve from "./routes/RouterMessirve"
import { AosInit } from "./components/hooks_components/UseAOS.jsx"

function App() {

  return (
    <>
    <AosInit configuracion={{ once: true }} />
    <RouterMessirve />
    </>
  )
}

export default App

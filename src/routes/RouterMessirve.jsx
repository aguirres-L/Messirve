import { Routes, Route } from "react-router-dom";
/* import MessirveComponent from "../ui_Messirve/MessirveComponent";
import Tablet_of_DT_Component from "../components/tablet/Tablet_of_DT_Component"; */
import GameComponent from "../app_web_game/components/GameComponent";
import RawgComponent from "../app_web_game/components/pages/rawg/RawgComponent";

export default function RouterMessirve() {
  return <Routes>
 {/*    <Route path="/" element={<MessirveComponent />} />
    <Route path="/tablet" element={<Tablet_of_DT_Component />} /> */}
    <Route path="/" element={<GameComponent />} />
    <Route path="/rawg" element={<RawgComponent />} />
  </Routes>
}
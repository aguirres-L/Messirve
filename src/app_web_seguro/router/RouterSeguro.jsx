import { Routes, Route, Navigate } from "react-router-dom";
import HomeComponent from "../components/home/HomeComponent.jsx";
import ClientDashboard from "../components/dashboard/client/ClientDashboard.jsx";
import LoginClientComponent from "../components/dashboard/client/login/LoginClientComponent.jsx";
import { RequireAuth, RequireRole } from "./segurity_Router/seguridadNavigation.js";
import LoginBroker from "../components/dashboard/broker/login_broker/LoginBroker.jsx";
import FormularioBroker from "../components/dashboard/broker/form_broker/FormularioBroker.jsx";

export function RouterSeguroModule() {
  return (
    <Routes>
      <Route index element={<HomeComponent />} />

      <Route path="admin" element={<LoginClientComponent />} />
      <Route path="broker" element={<LoginBroker />} />

      <Route element={<RequireAuth rutaLogin="/admin" />}>
        <Route
          path="cliente"
          element={
            <RequireRole rolesPermitidos={["cliente", "admin", "broker-admin"]} rutaSinPermiso="/admin">
              <ClientDashboard />
            </RequireRole>
          }
        />
      </Route>

      <Route element={<RequireAuth rutaLogin="/broker" />}>
        <Route
          path="broker/formulario"
          element={
            <RequireRole rolesPermitidos={["broker"]} rutaSinPermiso="/broker">
              <FormularioBroker />
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function RouterSeguro() {
  return <RouterSeguroModule />;
}


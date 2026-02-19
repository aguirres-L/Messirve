const CUENTAS_DEMO = [
  {
    correo: "broker@user.com",
    contrasena: "1234",
    rol: "broker",
    nombre: "Broker demo",
  },
  {
    correo: "cliente@user.com",
    contrasena: "1234",
    rol: "cliente",
    nombre: "Cliente demo",
  },
  {
    correo: "admin@user.com",
    contrasena: "1234",
    rol: "admin",
    nombre: "Admin demo",
  },
];

export function autenticarCredencialesDemo({ correo, contrasena }) {
  const correoNormalizado = String(correo ?? "").trim().toLowerCase();
  const contrasenaNormalizada = String(contrasena ?? "").trim();

  const cuenta = CUENTAS_DEMO.find(
    (item) =>
      item.correo.toLowerCase() === correoNormalizado &&
      item.contrasena === contrasenaNormalizada
  );

  if (!cuenta) {
    // Modo demo flexible: permite cualquier correo con password 1234.
    // Rol por defecto: "cliente". Si el correo incluye keywords, asigna rol acorde.
    if (contrasenaNormalizada === "1234" && correoNormalizado.includes("@")) {
      const isBrokerAdmin = correoNormalizado.includes("broker-admin");
      const isBroker = !isBrokerAdmin && correoNormalizado.includes("broker");
      const isAdmin = !isBrokerAdmin && correoNormalizado.includes("admin");

      const rol = isBrokerAdmin
        ? "broker-admin"
        : isAdmin
          ? "admin"
          : isBroker
            ? "broker"
            : "cliente";

      return {
        ok: true,
        token: `demo_${rol}_${Date.now()}`,
        rol,
        correo: correoNormalizado,
        nombre: "Demo",
      };
    }

    return {
      ok: false,
      mensajeDeError: "Credenciales inválidas. Probá con los accesos demo.",
    };
  }

  return {
    ok: true,
    token: `demo_${cuenta.rol}_${Date.now()}`,
    rol: cuenta.rol,
    correo: cuenta.correo,
    nombre: cuenta.nombre,
  };
}


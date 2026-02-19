import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configFirebase.js";

const COLECCION_ADMIN = "admin_data";

/**
 * Obtiene todos los documentos de la colección admin_data.
 * @returns {Promise<Array<{ id: string, email?: string, name?: string, ... }>>} Lista de admins con id incluido
 */
export async function getAdmins() {
  const snapshot = await getDocs(collection(db, COLECCION_ADMIN));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Autentica un usuario (admin/cliente) con email o nombre y contraseña contra la colección admin_data.
 * Los documentos tienen: email, name, password y opcionalmente role/rol.
 * Acepta tanto email (ej. "admin@gmail.com") como nombre en el primer parámetro.
 *
 * @param {string} emailOrName - Email o nombre del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{ ok: true, token: string, rol: string, correo: string, nombre: string } | { ok: false, mensajeDeError?: string }>}
 */
export async function autenticarAdmin(emailOrName, password) {
  const valorTrim = String(emailOrName ?? "").trim();
  const valorParaEmail = valorTrim.toLowerCase();
  const passwordTrim = String(password ?? "").trim();

  if (!valorTrim || !passwordTrim) {
    return { ok: false, mensajeDeError: "Ingresá email o nombre y contraseña." };
  }

  const col = collection(db, COLECCION_ADMIN);
  const esEmail = valorParaEmail.includes("@");

  let doc;
  let datos;

  if (esEmail) {
    const q = query(col, where("email", "==", valorParaEmail));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { ok: false, mensajeDeError: "Credenciales inválidas. Verificá tus datos." };
    }
    doc = snapshot.docs[0];
    datos = doc.data();
  } else {
    const snapshot = await getDocs(col);
    const nombreBuscado = valorTrim.toLowerCase();
    const encontrado = snapshot.docs.find((d) => {
      const name = d.data().name != null ? String(d.data().name).trim().toLowerCase() : "";
      return name === nombreBuscado;
    });
    if (!encontrado) {
      return { ok: false, mensajeDeError: "Credenciales inválidas. Verificá tus datos." };
    }
    doc = encontrado;
    datos = doc.data();
  }
  const passwordGuardada = datos.password != null ? String(datos.password).trim() : "";

  if (passwordGuardada !== passwordTrim) {
    return { ok: false, mensajeDeError: "Credenciales inválidas. Verificá tus datos." };
  }

  const correo = datos.email != null ? String(datos.email).trim() : "";
  const nombre = datos.name != null ? String(datos.name).trim() : correo || valorTrim;
  const rol = datos.role ?? datos.rol ?? "cliente";

  return {
    ok: true,
    token: `admin_${doc.id}_${Date.now()}`,
    rol: String(rol).toLowerCase(),
    correo,
    nombre,
  };
}

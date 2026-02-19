import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configFirebase.js";

const COLECCION_BROKER = "broker_data";

/**
 * Obtiene todos los documentos de la colección broker_data.
 * @returns {Promise<Array<{ id: string, email: string, name: string, ... }>>} Lista de brokers con id incluido
 */
export async function getBrokers() {
  const snapshot = await getDocs(collection(db, COLECCION_BROKER));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Autentica un broker con email o nombre y contraseña contra la colección broker_data.
 * Los documentos tienen: email, name, password.
 * Acepta tanto email (ej. "b1@b1.com") como nombre (ej. "broker2") en el primer parámetro.
 * @param {string} emailOrName - Email o nombre del broker
 * @param {string} password - Contraseña en texto plano (Firestore guarda el valor tal cual por ahora)
 * @returns {Promise<{ ok: true, token: string, rol: string, correo: string, nombre: string } | { ok: false }>}
 */
export async function autenticarBroker(emailOrName, password) {
  const valorTrim = String(emailOrName ?? "").trim();
  const valorParaEmail = valorTrim.toLowerCase();
  const passwordTrim = String(password ?? "").trim();

  if (!valorTrim || !passwordTrim) {
    return { ok: false };
  }

  const col = collection(db, COLECCION_BROKER);
  const esEmail = valorParaEmail.includes("@");

  // Buscar por email o por name según lo que ingresó el usuario
  const q = esEmail
    ? query(col, where("email", "==", valorParaEmail))
    : query(col, where("name", "==", valorTrim));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { ok: false };
  }

  const doc = snapshot.docs[0];
  const datos = doc.data();
  const passwordGuardada = datos.password != null ? String(datos.password).trim() : "";

  if (passwordGuardada !== passwordTrim) {
    return { ok: false };
  }

  const correo = datos.email != null ? String(datos.email).trim() : "";
  const nombre = datos.name != null ? String(datos.name).trim() : correo || valorTrim;

  return {
    ok: true,
    token: `broker_${doc.id}_${Date.now()}`,
    rol: "broker",
    correo,
    nombre,
  };
}

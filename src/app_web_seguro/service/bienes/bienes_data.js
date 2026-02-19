import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../configFirebase.js";

const COLECCION_BIENES = "bienes_data";

/**
 * Obtiene todos los documentos de la colección bienes_data.
 * @returns {Promise<Array<{ id: string, ...datos }>>} Lista de bienes con id incluido
 */
export async function getBienes() {
  const snapshot = await getDocs(collection(db, COLECCION_BIENES));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Crea un documento en bienes_data con los datos del formulario de cotización y el broker.
 * Incluye timestamp del servidor para orden y auditoría.
 * Nota: Firestore rules exigen request.auth != null; si el broker no usa Firebase Auth,
 * puede ser necesario ajustar las reglas de bienes_data para permitir write.
 *
 * @param {Object} payload - Datos del formulario + broker: { ...formData, broker: { correo, nombre } }
 * @returns {Promise<{ ok: true, id: string } | { ok: false, error: string }>}
 */
export async function crearBien(payload) {
  try {
    const docRef = await addDoc(collection(db, COLECCION_BIENES), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { ok: true, id: docRef.id };
  } catch (err) {
    const mensaje = err?.message ?? "Error al guardar la solicitud.";
    return { ok: false, error: mensaje };
  }
}

import { API_URL } from "./api"

export const registrarFichaje = async (
  usuario_id: number,
  tipo: "entrada" | "salida"
) => {
  const response = await fetch(`${API_URL}/fichajes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario_id,
      tipo
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al registrar fichaje")
  }

  return data
}
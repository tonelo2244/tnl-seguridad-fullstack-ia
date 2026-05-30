import { API_URL } from "./api"

export const consultarChatbot = async (mensaje: string) => {
  const response = await fetch(`${API_URL}/chatbot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mensaje })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.mensaje || "Error al consultar el asistente")
  }

  return data
}
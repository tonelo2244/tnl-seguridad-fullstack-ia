import { useEffect, useState } from "react"

export const useReloj = () => {
  const [ahora, setAhora] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const fecha = new Date(ahora)

  const horaFormateada = fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return { horaFormateada, fechaFormateada }
}

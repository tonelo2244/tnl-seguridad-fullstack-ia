import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { registrarFichaje } from "../services/fichajesService"
import "../styles/pages.css"

type Estado = "cargando" | "ok" | "error"

const EntradaPage = () => {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [estado, setEstado] = useState<Estado>("cargando")
  const [mensaje, setMensaje] = useState("")
  const [horaRegistro, setHoraRegistro] = useState("")
  const [fechaRegistro, setFechaRegistro] = useState("")

  useEffect(() => {
    if (!usuario) return

    const ahora = new Date()
    setHoraRegistro(ahora.toLocaleTimeString("es-ES"))
    setFechaRegistro(ahora.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }))

    registrarFichaje(usuario.id, "entrada")
      .then((data) => {
        setMensaje(data.mensaje || "Entrada registrada correctamente.")
        setEstado("ok")
      })
      .catch(() => {
        setMensaje("No se pudo registrar la entrada. Inténtalo de nuevo.")
        setEstado("error")
      })
  }, [usuario])

  return (
    <main className="page-container">
      <button
        type="button"
        className="menu-button-page"
        onClick={() => navigate("/inicio")}
      >
        ☰
      </button>

      <section className="fichaje-card">
        {estado === "cargando" && (
          <p className="fichaje-texto">Registrando entrada...</p>
        )}

        {estado === "ok" && (
          <>
            <div className="fichaje-icono">✅</div>
            <h1>Entrada registrada</h1>
            <p className="fichaje-texto">{mensaje}</p>
            <div className="fichaje-info">
              <strong>{horaRegistro}</strong>
              <span>{fechaRegistro}</span>
            </div>
          </>
        )}

        {estado === "error" && (
          <>
            <div className="fichaje-icono">❌</div>
            <h1>Error al registrar</h1>
            <p className="fichaje-texto">{mensaje}</p>
          </>
        )}

        <button className="save-button" onClick={() => navigate("/inicio")}>
          Volver al panel
        </button>
      </section>
    </main>
  )
}

export default EntradaPage

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/dashboard.css"
import { registrarFichaje } from "../services/fichajesService"

type Usuario = {
  id: number
  nombre: string
  email: string
  role: string
}

const DashboardPage = () => {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [fechaHora, setFechaHora] = useState(new Date())

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")

    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }

    const intervalo = setInterval(() => {
      setFechaHora(new Date())
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  const horaFormateada = fechaHora.toLocaleTimeString("es-ES")

  const fechaFormateada = fechaHora.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const irAIncidencias = () => navigate("/incidencias")
  const irARondas = () => navigate("/historial")
  const irAParteDiario = () => navigate("/parte-diario")
  const irAPortalEmpleado = () => navigate("/portal-empleado")

  const registrarEntrada = async () => {
    if (!usuario) {
      alert("Usuario no autenticado")
      return
    }

    try {
      const data = await registrarFichaje(usuario.id, "entrada")
      alert(data.mensaje)
    } catch (error) {
      console.error("Error registrando entrada:", error)
      alert("Error al registrar la entrada")
    }
  }

  const registrarSalida = async () => {
    if (!usuario) {
      alert("Usuario no autenticado")
      return
    }

    try {
      const data = await registrarFichaje(usuario.id, "salida")
      alert(data.mensaje)
    } catch (error) {
      console.error("Error registrando salida:", error)
      alert("Error al registrar la salida")
    }
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Panel de Vigilante</h1>

        <p>
          {usuario
            ? `Bienvenido, ${usuario.nombre}`
            : "Ha iniciado sesión correctamente."}
        </p>
      </header>

      <main className="dashboard-main">
        <section className="reloj-widget">
          <h2>Fecha y hora</h2>
          <p className="reloj-hora">{horaFormateada}</p>
          <p className="reloj-fecha">{fechaFormateada}</p>
        </section>

        <section className="dashboard-card">
          <h2>Acciones rápidas</h2>

          <div className="dashboard-buttons">
            <button onClick={irAIncidencias}>Ir a incidencias</button>
            <button onClick={irARondas}>Ir a rondas</button>
            <button onClick={registrarEntrada}>Entrada</button>
            <button onClick={registrarSalida}>Salida</button>
            <button onClick={irAParteDiario}>Parte diario</button>
            <button onClick={irAPortalEmpleado}>Portal del empleado</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage

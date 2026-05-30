import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useReloj } from "../hooks/useReloj"
import "../styles/home.css"
import tnlLogo from "../assets/tnl-logo.jpg"

interface Tiempo {
  temperatura: number
  descripcion: string
  icono: string
  clase: string
}

// Convierte el código WMO de Open-Meteo en descripción e icono
function parsearWttr(codigo: string, temp: number, esDeNoche: boolean): Tiempo {
  const n = Number(codigo)
  let descripcion = ""
  let icono = ""

  if (n === 0)        { descripcion = "Despejado";    icono = esDeNoche ? "🌙" : "☀️" }
  else if (n <= 2)    { descripcion = "Poco nublado"; icono = esDeNoche ? "🌛" : "⛅" }
  else if (n === 3)   { descripcion = "Nublado";      icono = "☁️" }
  else if (n <= 48)   { descripcion = "Niebla";       icono = "🌫️" }
  else if (n <= 55)   { descripcion = "Llovizna";     icono = "🌦️" }
  else if (n <= 65)   { descripcion = "Lluvia";       icono = "🌧️" }
  else if (n <= 77)   { descripcion = "Nieve";        icono = "❄️" }
  else if (n <= 82)   { descripcion = "Chubascos";    icono = "🌦️" }
  else if (n <= 86)   { descripcion = "Nieve";        icono = "❄️" }
  else                { descripcion = "Tormenta";     icono = "⛈️" }

  const clase =
    temp < 10 ? "tiempo-frio" :
    temp < 20 ? "tiempo-fresco" :
    temp < 28 ? "tiempo-templado" :
    "tiempo-calor"

  return { temperatura: temp, descripcion, icono, clase }
}

const HomePage = () => {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const { horaFormateada, fechaFormateada } = useReloj()

  const cerrarSesion = () => {
    logout()
    navigate("/")
  }

  const [tiempo, setTiempo] = useState<Tiempo | null>(null)
  const [cargandoTiempo, setCargandoTiempo] = useState(true)

  useEffect(() => {
    const fetchTiempo = async (lat: number, lon: number) => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`
      )
      if (!res.ok) throw new Error("Error de red")
      const data = await res.json()
      const temp = Math.round(data.current.temperature_2m)
      const codigo = data.current.weather_code ?? data.current.weathercode
      const esDeNoche = data.current.is_day === 0
      setTiempo(parsearWttr(String(codigo), temp, esDeNoche))
    }

    const errorFallback = () =>
      setTiempo({ temperatura: 0, descripcion: "Sin datos", icono: "❓", clase: "tiempo-fresco" })

    const cargar = () => {
      setCargandoTiempo(true)
      fetchTiempo(40.4168, -3.7038)
        .catch(errorFallback)
        .finally(() => setCargandoTiempo(false))
    }

    cargar()
    const intervalo = setInterval(cargar, 30 * 60 * 1000) // actualiza cada 30 min
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={tnlLogo} alt="TNL Seguridad" className="home-header-logo" />
        <h1>Panel de Vigilante</h1>
        <p>{usuario ? `Bienvenido, ${usuario.nombre}` : "Ha iniciado sesión correctamente."}</p>
        <button className="home-logout-btn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <main className="home-main">
        <div className="acciones-card">
          <h2>Acciones rápidas</h2>
          <button onClick={() => navigate("/incidencias")}>Ir a incidencias</button>
          <button onClick={() => navigate("/historial")}>Ir a rondas</button>
          <button onClick={() => navigate("/entrada")}>Entrada</button>
          <button onClick={() => navigate("/salida")}>Salida</button>
          <button onClick={() => navigate("/parte-diario")}>Parte diario</button>
          <button onClick={() => navigate("/portal-empleado")}>Portal del empleado</button>
        </div>

        <div className={`reloj-widget ${tiempo?.clase ?? ""}`}>
          <div className="reloj-seccion-hora">
            <span className="reloj-hora">{horaFormateada}</span>
            <span className="reloj-fecha">{fechaFormateada}</span>
          </div>

          <div className="reloj-divisor" />

          <div className="reloj-seccion-tiempo">
            {cargandoTiempo ? (
              <span className="reloj-cargando">Obteniendo tiempo...</span>
            ) : tiempo ? (
              <>
                <span className="tiempo-icono">{tiempo.icono}</span>
                <div className="tiempo-info">
                  <span className="tiempo-temp">{tiempo.temperatura}°C</span>
                  <span className="tiempo-desc">{tiempo.descripcion}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage

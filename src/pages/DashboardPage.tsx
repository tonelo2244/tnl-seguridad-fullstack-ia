import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/dashboard.css"

interface Tiempo {
  temperatura: number
  descripcion: string
  icono: string
  clase: string
}

function parsearWttr(codigo: number, temp: number, esDeNoche: boolean): Tiempo {
  let descripcion = ""
  let icono = ""

  if (codigo === 0)        { descripcion = "Despejado";    icono = esDeNoche ? "🌙" : "☀️" }
  else if (codigo <= 2)    { descripcion = "Poco nublado"; icono = esDeNoche ? "🌛" : "⛅" }
  else if (codigo === 3)   { descripcion = "Nublado";      icono = "☁️" }
  else if (codigo <= 48)   { descripcion = "Niebla";       icono = "🌫️" }
  else if (codigo <= 55)   { descripcion = "Llovizna";     icono = "🌦️" }
  else if (codigo <= 65)   { descripcion = "Lluvia";       icono = "🌧️" }
  else if (codigo <= 77)   { descripcion = "Nieve";        icono = "❄️" }
  else if (codigo <= 82)   { descripcion = "Chubascos";    icono = "🌦️" }
  else if (codigo <= 86)   { descripcion = "Nieve";        icono = "❄️" }
  else                     { descripcion = "Tormenta";     icono = "⛈️" }

  const clase =
    temp < 10 ? "tiempo-frio" :
    temp < 20 ? "tiempo-fresco" :
    temp < 28 ? "tiempo-templado" :
    "tiempo-calor"

  return { temperatura: temp, descripcion, icono, clase }
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const [fechaHora, setFechaHora] = useState(new Date())
  const [tiempo, setTiempo] = useState<Tiempo | null>(null)
  const [cargandoTiempo, setCargandoTiempo] = useState(true)

  useEffect(() => {
    const intervalo = setInterval(() => setFechaHora(new Date()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const fetchTiempo = async () => {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current=temperature_2m,weather_code,is_day&timezone=auto"
      )
      if (!res.ok) throw new Error("Error de red")
      const data = await res.json()
      const temp = Math.round(data.current.temperature_2m)
      const codigo = data.current.weather_code ?? data.current.weathercode
      const esDeNoche = data.current.is_day === 0
      setTiempo(parsearWttr(Number(codigo), temp, esDeNoche))
    }

    const cargar = () => {
      setCargandoTiempo(true)
      fetchTiempo()
        .catch(() => setTiempo({ temperatura: 0, descripcion: "Sin datos", icono: "❓", clase: "tiempo-fresco" }))
        .finally(() => setCargandoTiempo(false))
    }

    cargar()
    const intervalo = setInterval(cargar, 30 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  const horaFormateada = fechaHora.toLocaleTimeString("es-ES")
  const fechaFormateada = fechaHora.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const irAIncidencias = () => {
    navigate("/incidencias")
  }

  const irARondas = () => {
    navigate("/historial")
  }

  const registrarEntrada = () => {
    navigate("/entrada")
  }

  const registrarSalida = () => {
    navigate("/salida")
  }

  const irAParteDiario = () => {
    navigate("/parte-diario")
  }

  const irAPortalEmpleado = () => {
    navigate("/portal-empleado")
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Panel de Vigilante</h1>
        <p>Ha iniciado sesión correctamente.</p>
      </header>

      <main className="dashboard-main">
        <section className={`reloj-widget ${tiempo?.clase ?? ""}`}>
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
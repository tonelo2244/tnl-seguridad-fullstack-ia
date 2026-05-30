import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/pages.css"

const ParteDiarioPage = () => {
  const navigate = useNavigate()

  const hoy = new Date()
  const anioActual = hoy.getFullYear()
  const mesActual = hoy.getMonth()

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null)
  const [servicio, setServicio] = useState("")
  const [vigilante, setVigilante] = useState("")
  const [incidencias, setIncidencias] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [mensajeGuardado, setMensajeGuardado] = useState("")
  const [fechasConParte, setFechasConParte] = useState<string[]>([])

  const volverAInicio = () => {
    navigate("/inicio")
  }

  const nombreMes = new Date(anioActual, mesActual).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  })

  const diasDelMes = new Date(anioActual, mesActual + 1, 0).getDate()
  const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay()
  const inicioCalendario = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1

  const diasCalendario = useMemo(() => {
    const celdas: (number | null)[] = []

    for (let i = 0; i < inicioCalendario; i++) celdas.push(null)
    for (let dia = 1; dia <= diasDelMes; dia++) celdas.push(dia)

    return celdas
  }, [inicioCalendario, diasDelMes])

  const crearFechaLocal = (dia: number) => {
    const anio = anioActual
    const mes = String(mesActual + 1).padStart(2, "0")
    const diaFormateado = String(dia).padStart(2, "0")

    return `${anio}-${mes}-${diaFormateado}`
  }

  const cargarFechasConParte = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/partes-diarios")
      const data = await res.json()

      const fechas = data.map((item: { fecha: string }) => item.fecha)
      setFechasConParte(fechas)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    cargarFechasConParte()
  }, [])

  useEffect(() => {
    const guardadas: string[] = JSON.parse(localStorage.getItem("fechasConParte") || "[]")
    if (guardadas.length > 0) {
      setFechasConParte(prev => [...new Set([...prev, ...guardadas])])
    }
  }, [])

  useEffect(() => {
    if (fechasConParte.length > 0) {
      localStorage.setItem("fechasConParte", JSON.stringify(fechasConParte))
    }
  }, [fechasConParte])

  const cargarParte = async (fecha: string) => {
    setFechaSeleccionada(fecha)

    try {
      const res = await fetch(`http://localhost:3001/api/partes-diarios/${fecha}`)
      const data = await res.json()

      if (data) {
        setServicio(data.servicio || "")
        setVigilante(data.vigilante || "")
        setIncidencias(data.incidencias || "")
        setObservaciones(data.observaciones || "")
        setMensajeGuardado("Parte cargado")
      } else {
        setServicio("")
        setVigilante("")
        setIncidencias("")
        setObservaciones("")
        setMensajeGuardado("No hay parte para esta fecha")
      }
    } catch (error) {
      console.error(error)
      setMensajeGuardado("Error al cargar el parte")
    }
  }

  const seleccionarDia = (dia: number) => {
    cargarParte(crearFechaLocal(dia))
  }

  const guardarParte = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!fechaSeleccionada) {
      alert("Debes seleccionar un día")
      return
    }

    try {
      setMensajeGuardado("Guardando...")

      const res = await fetch("http://localhost:3001/api/partes-diarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fecha: fechaSeleccionada,
          servicio,
          vigilante,
          incidencias,
          observaciones
        })
      })

      const data = await res.json()

      if (!res.ok) {
        console.error(data)
        setMensajeGuardado("Error al guardar el parte")
        return
      }

      setMensajeGuardado("Parte diario guardado correctamente")

      setFechasConParte((prev) =>
        !prev.includes(fechaSeleccionada) ? [...prev, fechaSeleccionada] : prev
      )
    } catch (error) {
      console.error(error)
      setMensajeGuardado("No se pudo conectar con el backend")
    }
  }

  const formatearFechaVisible = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("-")

    return new Date(Number(anio), Number(mes) - 1, Number(dia)).toLocaleDateString(
      "es-ES",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    )
  }

  return (
    <div className="page-container">
      <button type="button" className="menu-button-page" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Parte diario</h1>
      <p>Registro del parte diario del servicio.</p>

      <section className="parte-card">
        <h2 className="parte-titulo-mes">Calendario de {nombreMes}</h2>

        <div className="calendario-semana">
          <div>L</div>
          <div>M</div>
          <div>X</div>
          <div>J</div>
          <div>V</div>
          <div>S</div>
          <div>D</div>
        </div>

        <div className="calendario-grid">
          {diasCalendario.map((dia, index) =>
            dia === null ? (
              <div key={index} className="calendario-vacio"></div>
            ) : (
              <button
                key={index}
                type="button"
                className={`calendario-dia ${
                  fechaSeleccionada === crearFechaLocal(dia)
                    ? "dia-seleccionado"
                    : fechasConParte.includes(crearFechaLocal(dia))
                    ? "dia-con-parte"
                    : ""
                }`}
                onClick={() => seleccionarDia(dia)}
              >
                {dia}
              </button>
            )
          )}
        </div>
      </section>

      {fechaSeleccionada && (
        <section className="parte-form-card">
          <h2>Parte diario del {formatearFechaVisible(fechaSeleccionada)}</h2>

          <form className="parte-formulario" onSubmit={guardarParte}>
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input id="fecha" type="text" value={fechaSeleccionada} readOnly />
            </div>

            <div className="form-group">
              <label htmlFor="servicio">Servicio</label>
              <input
                id="servicio"
                type="text"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                placeholder="Ejemplo: Centro Comercial Norte"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vigilante">Vigilante</label>
              <input
                id="vigilante"
                type="text"
                value={vigilante}
                onChange={(e) => setVigilante(e.target.value)}
                placeholder="Nombre del vigilante"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="incidencias">Incidencias</label>
              <textarea
                id="incidencias"
                value={incidencias}
                onChange={(e) => setIncidencias(e.target.value)}
                placeholder="Describe las incidencias del servicio"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones generales del turno"
                rows={4}
              />
            </div>

            <button type="submit" className="save-button">
              Guardar parte diario
            </button>
          </form>

          {mensajeGuardado && <p className="mensaje-guardado">{mensajeGuardado}</p>}
        </section>
      )}
    </div>
  )
}

export default ParteDiarioPage
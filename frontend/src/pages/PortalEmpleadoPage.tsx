import { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { consultarChatbot } from "../services/chatbotService"
import "../styles/portal-empleado.css"

type MensajeChat = {
  autor: "usuario" | "bot"
  texto: string
}

const MAX_CARACTERES = 500

const PortalEmpleadoPage = () => {
  const navigate = useNavigate()
  const mensajesRef = useRef<HTMLDivElement>(null)

  const [consulta, setConsulta] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mensajes, setMensajes] = useState<MensajeChat[]>([])

  // Desplaza el chat hacia abajo cada vez que llega un mensaje nuevo
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight
    }
  }, [mensajes])

  const enviarConsulta = async () => {
    const texto = consulta.trim()
    if (!texto || cargando) return

    setMensajes((prev) => [...prev, { autor: "usuario", texto }])
    setConsulta("")
    setCargando(true)

    try {
      const data = await consultarChatbot(texto)
      setMensajes((prev) => [...prev, { autor: "bot", texto: data.respuesta }])
    } catch {
      setMensajes((prev) => [
        ...prev,
        { autor: "bot", texto: "No se pudo obtener respuesta en este momento. Inténtalo más tarde." }
      ])
    } finally {
      setCargando(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") enviarConsulta()
  }

  const caracteresRestantes = MAX_CARACTERES - consulta.length

  return (
    <div className="portal-page">
      <button type="button" className="menu-button-page" onClick={() => navigate("/inicio")}>
        ☰
      </button>

      <h1 className="portal-title">Portal del empleado</h1>
      <p>Acceso a información personal y documentación laboral.</p>

      <div className="portal-buttons">
        <button>Nóminas</button>
        <button>Cuadrante</button>
        <button>Formación</button>
        <button>Documentación</button>
      </div>

      <section className="chatbot-card">
        <h2>Asistente de consultas</h2>
        <p className="chatbot-descripcion">
          Especializado en el <strong>Convenio Colectivo de Seguridad Privada</strong> 
        </p>

        <div className="chatbot-mensajes" ref={mensajesRef}>
          {mensajes.length === 0 && (
            <p className="chatbot-vacio">
              Puedes preguntar sobre nóminas, vacaciones, permisos, jornada laboral, categorías profesionales, formación o cualquier duda sobre tu relación laboral en el sector de la seguridad privada.
            </p>
          )}

          {mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={mensaje.autor === "usuario" ? "mensaje-chat usuario" : "mensaje-chat bot"}
            >
              {mensaje.texto}
            </div>
          ))}

          {cargando && (
            <div className="mensaje-chat bot chatbot-escribiendo">
              Consultando...
            </div>
          )}
        </div>

        <div className="chatbot-form">
          <div className="chatbot-input-wrapper">
            <input
              type="text"
              placeholder="Escribe tu consulta sobre seguridad privada..."
              value={consulta}
              onChange={(e) => setConsulta(e.target.value.slice(0, MAX_CARACTERES))}
              onKeyDown={handleKeyDown}
              disabled={cargando}
            />
            <span className={`chatbot-contador ${caracteresRestantes < 50 ? "chatbot-contador-aviso" : ""}`}>
              {caracteresRestantes}
            </span>
          </div>

          <button type="button" onClick={enviarConsulta} disabled={cargando || !consulta.trim()}>
            {cargando ? "..." : "Enviar"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default PortalEmpleadoPage

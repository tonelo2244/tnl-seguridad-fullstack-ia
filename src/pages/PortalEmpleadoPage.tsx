import { useNavigate } from "react-router-dom"
import "../styles/portal-empleado.css"

const PortalEmpleadoPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <div className="portal-page">
      <button type="button" onClick={volverAInicio}>
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
    </div>
  )
}

export default PortalEmpleadoPage
import { useNavigate } from "react-router-dom"
import "../styles/pages.css"

const IncidenciasPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section className="page-container">
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Incidencias</h1>
      <p>Aquí podrás registrar y consultar incidencias.</p>
    </section>
  )
}

export default IncidenciasPage
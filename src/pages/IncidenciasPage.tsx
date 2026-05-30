import { useNavigate } from "react-router-dom"

const IncidenciasPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section>
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Incidencias</h1>
      <p>Aquí podrás registrar y consultar incidencias.</p>
    </section>
  )
}

export default IncidenciasPage
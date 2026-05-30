import { useNavigate } from "react-router-dom"

const HistorialPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section>
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Rondas</h1>
      <p>Aquí podrás consultar o registrar las rondas.</p>
    </section>
  )
}

export default HistorialPage
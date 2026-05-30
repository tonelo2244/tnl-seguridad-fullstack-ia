import { useNavigate } from "react-router-dom"

const ParteDiarioPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section>
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Parte diario</h1>
      <p>Registro del parte diario del servicio.</p>
    </section>
  )
}

export default ParteDiarioPage
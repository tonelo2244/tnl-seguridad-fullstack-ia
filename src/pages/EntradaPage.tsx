import { useNavigate } from "react-router-dom"

const EntradaPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section style={{ padding: "30px" }}>
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Entrada</h1>
      <p>Registro de la entrada del turno.</p>
    </section>
  )
}

export default EntradaPage
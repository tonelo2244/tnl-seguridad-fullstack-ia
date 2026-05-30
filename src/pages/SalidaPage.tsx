import { useNavigate } from "react-router-dom"

const SalidaPage = () => {
  const navigate = useNavigate()

  const volverAInicio = () => {
    navigate("/inicio")
  }

  return (
    <section style={{ padding: "30px" }}>
      <button type="button" onClick={volverAInicio}>
        ☰
      </button>

      <h1>Salida</h1>
      <p>Registro de la salida del turno.</p>
    </section>
  )
}

export default SalidaPage
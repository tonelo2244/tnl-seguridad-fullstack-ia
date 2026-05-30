import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import logoTnl from "../assets/tnl-logo.jpg"
import "../styles/login.css"

const LoginPage = () => {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [panelAbierto, setPanelAbierto] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate("/inicio")
  }

  const togglePanel = () => {
    setPanelAbierto(!panelAbierto)
  }

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${logoTnl})` }}
    >
      <header className="topbar">
        <div className="topbar-title">TNL SEGURIDAD</div>

        <button
          className="menu-button"
          onClick={togglePanel}
          type="button"
        >
          ☰
        </button>
      </header>

      <div className="login-content">
        <main className="login-main">
          <div className="login-card">
            <h1 className="login-title">Acceso</h1>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="usuario">Correo electrónico</label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="login-button">
                Entrar
              </button>
            </form>
          </div>
        </main>

        {panelAbierto && (
        <aside className="side-panel">
  <div className="side-panel-logo">
    <img src={logoTnl} alt="Logo TNL Seguridad" />
  </div>

  <button type="button" className="side-panel-button">
    Acerca de
  </button>

  <button type="button" className="side-panel-button">
    Idioma
  </button>

  <button type="button" className="side-panel-button">
    Notificaciones
  </button>
</aside>
        )}
      </div>
    </div>
  )
}

export default LoginPage
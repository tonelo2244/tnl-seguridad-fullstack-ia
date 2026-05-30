import { Outlet } from "react-router"
import { useEffect, useRef, useState } from "react"
import logoTnl from "../assets/tnl-logo.jpg"

const Layout = () => {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      const target = event.target as Node

      const clickDentroMenu = menuRef.current?.contains(target)
      const clickEnBoton = buttonRef.current?.contains(target)

      if (!clickDentroMenu && !clickEnBoton) {
        setMenuAbierto(false)
      }
    }

    document.addEventListener("mousedown", handleClickFuera)

    return () => {
      document.removeEventListener("mousedown", handleClickFuera)
    }
  }, [])

  return (
    <>
      <header className="topbar">
        <p className="topbar-title">TNL SEGURIDAD</p>

        <button
          ref={buttonRef}
          className="menu-button"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {menuAbierto && (
          <div ref={menuRef} className="menu-panel">
            <img src={logoTnl} alt="Logo TNL" className="menu-logo" />

            <nav className="menu-links">
              <a href="#">Acerca de</a>
              <a href="#">Idioma</a>
              <a href="#">Notificaciones</a>
              <a href="#">Perfil</a>
              <a href="#">Cerrar sesión</a>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
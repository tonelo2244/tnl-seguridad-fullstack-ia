import { createContext, useContext, useState, type ReactNode } from "react"

export type Usuario = {
  id: number
  nombre: string
  email: string
  role: string
}

type AuthContextType = {
  usuario: Usuario | null
  login: (usuario: Usuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem("usuario")
    return guardado ? (JSON.parse(guardado) as Usuario) : null
  })

  const login = (nuevoUsuario: Usuario) => {
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario))
    setUsuario(nuevoUsuario)
  }

  const logout = () => {
    localStorage.removeItem("usuario")
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}

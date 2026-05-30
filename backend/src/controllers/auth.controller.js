import pool from "../config/db.js"
import bcrypt from "bcrypt"

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios"
      })
    }

    const result = await pool.query(
      "SELECT id, nombre, email, password, role FROM usuarios WHERE email = $1",
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      })
    }

    const usuario = result.rows[0]

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas"
      })
    }

    return res.status(200).json({
      mensaje: "Login correcto",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    })
  } catch (error) {
    console.error("Error en login:", error)

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    })
  }
}
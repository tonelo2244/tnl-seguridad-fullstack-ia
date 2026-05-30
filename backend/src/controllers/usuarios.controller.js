import pool from "../config/db.js"
import bcrypt from "bcrypt"

export const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, email, role FROM usuarios ORDER BY id ASC"
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    })
  }
}

export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body

    if (!nombre || !email || !password || !role) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      })
    }

    const usuarioExistente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    )

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, role`,
      [nombre, email, passwordHash, role]
    )

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: result.rows[0]
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    })
  }
}

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params

    if (isNaN(Number(id))) {
      return res.status(400).json({
        mensaje: "El id debe ser numérico"
      })
    }

    const result = await pool.query(
      "SELECT id, nombre, email, role FROM usuarios WHERE id = $1",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      })
    }

    return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error("Error al obtener usuario por id:", error)

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    })
  }
}
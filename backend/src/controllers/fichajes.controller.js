import pool from "../config/db.js"

export const registrarFichaje = async (req, res) => {
  const { usuario_id, tipo } = req.body

  if (!usuario_id || !tipo) {
    return res.status(400).json({
      mensaje: "Faltan datos obligatorios"
    })
  }

  if (tipo !== "entrada" && tipo !== "salida") {
    return res.status(400).json({
      mensaje: "El tipo de fichaje no es válido"
    })
  }

  try {
    const usuarioExiste = await pool.query(
      "SELECT id FROM usuarios WHERE id = $1",
      [usuario_id]
    )

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      })
    }

    const result = await pool.query(
      `INSERT INTO fichajes (usuario_id, tipo)
       VALUES ($1, $2)
       RETURNING id, usuario_id, tipo, fecha`,
      [usuario_id, tipo]
    )

    return res.status(201).json({
      mensaje: `Fichaje de ${tipo} registrado correctamente`,
      fichaje: result.rows[0]
    })
  } catch (error) {
    console.error("Error al registrar fichaje:", error)

    return res.status(500).json({
      mensaje: "Error interno del servidor"
    })
  }
}
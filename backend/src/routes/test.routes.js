import { Router } from "express"
import pool from "../config/db.js"

const router = Router()

router.get("/", (req, res) => {
  res.json({
    mensaje: "API de TNL Seguridad funcionando"
  })
})

router.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")

    res.json({
      mensaje: "Conexión con PostgreSQL correcta",
      fecha: result.rows[0].now
    })
  } catch (error) {
    console.error("Error real de PostgreSQL:", error)

    res.status(500).json({
      mensaje: "Error al conectar con la base de datos",
      error: error.message
    })
  }
})

export default router
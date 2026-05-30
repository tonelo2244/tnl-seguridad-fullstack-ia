import express from "express"
import pool from "../config/db.js"

const router = express.Router()
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM partes_diarios"
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener fechas" })
  }
})

router.get("/:fecha", async (req, res) => {
  const { fecha } = req.params

  const result = await pool.query(
    "SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, servicio, vigilante, incidencias, observaciones, created_at FROM partes_diarios WHERE fecha = $1",
    [fecha]
  )

  res.json(result.rows[0] || null)
})

router.post("/", async (req, res) => {
  const { fecha, servicio, vigilante, incidencias, observaciones } = req.body

  const result = await pool.query(
    `
    INSERT INTO partes_diarios 
    (fecha, servicio, vigilante, incidencias, observaciones)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (fecha)
    DO UPDATE SET 
      servicio = EXCLUDED.servicio,
      vigilante = EXCLUDED.vigilante,
      incidencias = EXCLUDED.incidencias,
      observaciones = EXCLUDED.observaciones
    RETURNING *
    `,
    [fecha, servicio, vigilante, incidencias, observaciones]
  )

  res.json(result.rows[0])
})

export default router
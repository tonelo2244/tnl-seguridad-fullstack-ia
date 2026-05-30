import { Router } from "express"
import {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId
} from "../controllers/usuarios.controller.js"

const router = Router()

router.get("/", obtenerUsuarios)
router.get("/:id", obtenerUsuarioPorId)
router.post("/", crearUsuario)

export default router
import { Router } from "express"
import { registrarFichaje } from "../controllers/fichajes.controller.js"

const router = Router()

router.post("/", registrarFichaje)

export default router
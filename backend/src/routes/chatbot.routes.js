import { Router } from "express"
import { consultarChatbot } from "../controllers/chatbot.controller.js"

const router = Router()

router.post("/", consultarChatbot)

export default router
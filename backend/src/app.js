import express from "express"
import cors from "cors"
import testRoutes from "./routes/test.routes.js"
import usuariosRoutes from "./routes/usuarios.routes.js"
import authRoutes from "./routes/auth.routes.js"
import fichajesRoutes from "./routes/fichajes.routes.js"
import chatbotRoutes from "./routes/chatbot.routes.js" 
import partesDiariosRoutes from "./routes/partesDiarios.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/test", testRoutes)
app.use("/api/usuarios", usuariosRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/fichajes", fichajesRoutes)
app.use("/api/chatbot", chatbotRoutes)
app.use("/api/partes-diarios", partesDiariosRoutes)

export default app
import dotenv from "dotenv"
import { execSync } from "child_process"
import app from "./app.js"

dotenv.config()

const PORT = process.env.PORT || 3000

// Libera el puerto si ya está en uso (útil al reiniciar con --watch)
try {
  const pid = execSync(`lsof -ti :${PORT}`).toString().trim()
  if (pid) execSync(`kill -9 ${pid}`)
} catch {
  // No había ningún proceso en el puerto, todo correcto
}

app.listen(PORT, () => {
  console.log(`Servidor backend funcionando en http://localhost:${PORT}`)
})
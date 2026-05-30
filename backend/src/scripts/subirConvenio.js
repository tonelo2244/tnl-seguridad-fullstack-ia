/**
 * Script de configuración — ejecutar UNA sola vez:
 *   node src/scripts/subirConvenio.js
 *
 * Coloca el PDF del convenio en backend/ con el nombre:
 *   convenio-seguridad-privada.pdf
 *
 * El script sube el fichero a OpenAI, crea un vector store y
 * guarda el VECTOR_STORE_ID automáticamente en el .env.
 */

import OpenAI from "openai"
import { createReadStream, readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"
import dotenv from "dotenv"

dotenv.config()

const RUTA_PDF = resolve("convenio-seguridad-privada.pdf")
const RUTA_ENV = resolve(".env")

if (!existsSync(RUTA_PDF)) {
  console.error(`❌ No se encontró el fichero: ${RUTA_PDF}`)
  console.error("   Descarga el convenio del BOE y colócalo en la carpeta backend/ con ese nombre.")
  process.exit(1)
}

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Falta OPENAI_API_KEY en el .env")
  process.exit(1)
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const run = async () => {
  console.log("📄 Subiendo el convenio a OpenAI...")

  // 1. Subir el fichero
  const fichero = await client.files.create({
    file: createReadStream(RUTA_PDF),
    purpose: "assistants"
  })
  console.log(`   Fichero subido: ${fichero.id}`)

  // 2. Crear el vector store
  console.log("🗂️  Creando vector store...")
  const vectorStore = await client.vectorStores.create({
    name: "Convenio Colectivo Seguridad Privada España",
    file_ids: [fichero.id]
  })
  console.log(`   Vector store creado: ${vectorStore.id}`)

  // 3. Esperar a que el fichero esté procesado
  console.log("⏳ Procesando el documento (puede tardar unos segundos)...")
  let store = await client.vectorStores.retrieve(vectorStore.id)
  while (store.file_counts.in_progress > 0) {
    await new Promise(r => setTimeout(r, 3000))
    store = await client.vectorStores.retrieve(vectorStore.id)
    process.stdout.write(".")
  }
  console.log("\n   Procesado correctamente.")

  // 4. Guardar VECTOR_STORE_ID en el .env
  let envContent = readFileSync(RUTA_ENV, "utf-8")
  if (envContent.includes("VECTOR_STORE_ID")) {
    envContent = envContent.replace(/VECTOR_STORE_ID=.*/, `VECTOR_STORE_ID=${vectorStore.id}`)
  } else {
    envContent += `\nVECTOR_STORE_ID=${vectorStore.id}`
  }
  writeFileSync(RUTA_ENV, envContent)

  console.log(`\n✅ Listo. VECTOR_STORE_ID=${vectorStore.id}`)
  console.log("   Reinicia el servidor backend para que el chatbot use el convenio.")
}

run().catch((err) => {
  console.error("❌ Error:", err.message)
  process.exit(1)
})

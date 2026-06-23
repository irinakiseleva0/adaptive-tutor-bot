import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import chatRouter from "./routes/chat.js"
import topicsRouter from "./routes/topics.js"
import authRouter from "./routes/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/topics", topicsRouter)
app.use("/api/chat", chatRouter)

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Adaptive Tutor Bot backend running on port ${PORT}`)
})
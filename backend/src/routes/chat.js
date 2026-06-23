import express from "express"
import { getTutorResponse } from "../services/groqService.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()
router.use(authenticateToken)

// POST /api/chat
// Body: { message, topic, difficultyLevel, history, previousAnalogies }
router.post("/", async (req, res) => {
    try {
        const { message, topic, difficultyLevel = 2, history = [], previousAnalogies = [] } = req.body

        if (!message || !topic) {
            return res.status(400).json({ error: "message and topic are required" })
        }

        const result = await getTutorResponse({
            message,
            topic,
            difficultyLevel,
            history,
            previousAnalogies
        })

        res.json(result)
    } catch (error) {
        console.error("Chat error:", error)
        res.status(500).json({ error: "Failed to get tutor response" })
    }
})

export default router
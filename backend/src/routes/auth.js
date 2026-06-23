import express from "express"
import jwt from "jsonwebtoken"

const router = express.Router()

const USERS = [
  { id: 1, username: "student1", password: "password123", role: "student" },
  { id: 2, username: "admin", password: "admin123", role: "admin" }
]

router.post("/login", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" })
  }

  const user = USERS.find(u => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  )

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  })
})

export default router
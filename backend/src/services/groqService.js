import Groq from "groq-sdk"
import dotenv from "dotenv"

dotenv.config()

let groqClient = null

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is not set. Copy .env.example to .env and add your key from https://console.groq.com"
      )
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return groqClient
}

const DIFFICULTY_LEVELS = {
  1: "beginner",
  2: "intermediate",
  3: "advanced"
}

const DOWNGRADE_SIGNALS = [
  "i don't understand",
  "i dont understand",
  "too complicated",
  "too complex",
  "simpler",
  "more simple",
  "confused",
  "what does that mean",
  "explain again",
  "lost me"
]

const UPGRADE_SIGNALS = [
  "too simple",
  "too easy",
  "i already know",
  "more detail",
  "go deeper",
  "more advanced",
  "more technical"
]

function detectFeedbackSignal(message) {
  const lower = message.toLowerCase()

  if (DOWNGRADE_SIGNALS.some(signal => lower.includes(signal))) {
    return "downgrade"
  }
  if (UPGRADE_SIGNALS.some(signal => lower.includes(signal))) {
    return "upgrade"
  }
  return null
}

function adjustDifficulty(currentLevel, signal) {
  if (signal === "downgrade") {
    return Math.max(1, currentLevel - 1)
  }
  if (signal === "upgrade") {
    return Math.min(3, currentLevel + 1)
  }
  return currentLevel
}

function buildSystemPrompt(topic, difficultyLevel, previousAnalogies = []) {
  const levelName = DIFFICULTY_LEVELS[difficultyLevel]

  let prompt = `You are a distributed systems tutor helping a student understand "${topic}". `
  prompt += `Explain at a ${levelName} level. `

  if (levelName === "beginner") {
    prompt += "Use a simple real-world analogy, avoid jargon, keep it short. "
  } else if (levelName === "intermediate") {
    prompt += "Use precise terminology but still ground it with one practical example. "
  } else {
    prompt += "Be technically rigorous, mention edge cases and trade-offs, assume strong prior knowledge. "
  }

  if (previousAnalogies.length > 0) {
    prompt += `Do not reuse these analogies already given: ${previousAnalogies.join(", ")}. Use a fresh one. `
  }

  prompt += "Keep responses focused and not too long. End by asking if the explanation was clear."

  return prompt
}

async function getTutorResponse({ message, topic, difficultyLevel, history = [], previousAnalogies = [] }) {
  const signal = detectFeedbackSignal(message)
  const newDifficultyLevel = adjustDifficulty(difficultyLevel, signal)

  const systemPrompt = buildSystemPrompt(topic, newDifficultyLevel, previousAnalogies)

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message }
  ]

  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
    temperature: 0.7,
    max_tokens: 500
  })

  const replyText = completion.choices[0].message.content

  return {
    reply: replyText,
    difficultyLevel: newDifficultyLevel,
    difficultyLabel: DIFFICULTY_LEVELS[newDifficultyLevel],
    signalDetected: signal
  }
}

export { getTutorResponse, DIFFICULTY_LEVELS }
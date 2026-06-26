const API_BASE_URL = "http://localhost:3001/api"

export async function login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    return response.json()
}

export async function getTopics() {
    const response = await fetch(`${API_BASE_URL}/topics`)

    if (!response.ok) {
        throw new Error("Failed to fetch topics")
    }

    return response.json()
}

export async function sendChatMessage({ message, topic, difficultyLevel, history, previousAnalogies, token }) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message, topic, difficultyLevel, history, previousAnalogies })
    })

    if (!response.ok) {
        throw new Error("Failed to send chat message")
    }

    return response.json()
}
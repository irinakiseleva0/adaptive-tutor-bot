import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendChatMessage } from "../api"

function Chat({ token, selectedTopic }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [difficultyLevel, setDifficultyLevel] = useState(2)
    const [previousAnalogies, setPreviousAnalogies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    if (!token || !selectedTopic) {
        navigate("/")
        return null
    }

    async function handleSend(e) {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { role: "user", content: input }
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput("")
        setError("")
        setLoading(true)

        try {
            const historyForApi = updatedMessages.map((m) => ({
                role: m.role,
                content: m.content
            }))

            const data = await sendChatMessage({
                message: userMessage.content,
                topic: selectedTopic,
                difficultyLevel,
                history: historyForApi.slice(0, -1),
                previousAnalogies,
                token
            })

            setMessages([...updatedMessages, { role: "assistant", content: data.reply }])
            setDifficultyLevel(data.difficultyLevel)
        } catch (err) {
            setError("Erreur lors de l'envoi du message")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Chat — {selectedTopic}</h1>
                <button onClick={() => navigate("/")}>Retour</button>
            </div>

            <p>Niveau actuel : <strong>{difficultyLevel}</strong></p>

            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", minHeight: "300px", marginBottom: "16px" }}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: "12px",
                            textAlign: msg.role === "user" ? "right" : "left"
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                backgroundColor: msg.role === "user" ? "#dbe9ff" : "#f0f0f0",
                                maxWidth: "80%"
                            }}
                        >
                            {msg.content}
                        </span>
                    </div>
                ))}
                {loading && <p>Le tuteur réfléchit...</p>}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écris ton message..."
                    style={{ flex: 1, padding: "10px" }}
                />
                <button type="submit" disabled={loading}>Envoyer</button>
            </form>
        </div>
    )
}

export default Chat
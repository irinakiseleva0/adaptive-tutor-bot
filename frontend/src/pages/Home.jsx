import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getTopics } from "../api"

function Home({ token, setToken, setSelectedTopic }) {
    const [topics, setTopics] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/login")
            return
        }

        async function fetchTopics() {
            try {
                const data = await getTopics()
                setTopics(data)
            } catch (err) {
                setError("Impossible de charger les topics")
            } finally {
                setLoading(false)
            }
        }
        fetchTopics()
    }, [token])

    function handleSelectTopic(topicId) {
        setSelectedTopic(topicId)
        navigate("/chat")
    }

    function handleLogout() {
        setToken(null)
        navigate("/login")
    }

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Choisis un topic</h1>
                <button onClick={handleLogout}>Déconnexion</button>
            </div>

            {loading && <p>Chargement...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        style={{ padding: "14px", textAlign: "left", cursor: "pointer" }}
                    >
                        <div>
                            <strong>{topic.title}</strong>
                            <div style={{ fontSize: "0.85em", color: "#666" }}>{topic.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Home
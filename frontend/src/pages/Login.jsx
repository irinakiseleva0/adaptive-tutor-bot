import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api"

function Login({ setToken }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await login(username, password)
            setToken(data.token)
            navigate("/")
        } catch (err) {
            setError("Identifiants incorrects")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "60px auto", padding: "20px" }}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    )
}

export default Login
import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Chat from "./pages/Chat"

function App() {
    const [token, setToken] = useState(null)
    const [selectedTopic, setSelectedTopic] = useState(null)

    return (
        <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
                path="/"
                element={
                    token ? (
                        <Home token={token} setToken={setToken} setSelectedTopic={setSelectedTopic} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/chat"
                element={
                    token ? (
                        <Chat token={token} selectedTopic={selectedTopic} />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    )
}

export default App
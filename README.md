# Adaptive Tutor Bot

A chatbot that helps students study distributed systems topics. The bot adapts the depth of its explanations based on student feedback during the conversation.

## How it works

The student picks a topic (CAP theorem, saga pattern, consistent hashing, etc.) and starts a conversation. If they say something like "I don't understand" or "too complicated", the bot detects this and re-explains using a simpler analogy. If they say "go deeper" or "too easy", it switches to a more technical explanation.

Difficulty levels: 1 = beginner, 2 = intermediate, 3 = advanced.

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React
- **AI**: Groq API (llama-3.1-8b-instant)
- **Auth**: JWT

## Project Structure

```
adaptive-tutor-bot/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js       # POST /api/auth/login
│   │   │   ├── chat.js       # POST /api/chat
│   │   │   └── topics.js     # GET /api/topics
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   ├── services/
│   │   │   └── groqService.js # Adaptive difficulty logic + Groq integration
│   │   ├── benchmark.js      # OpenRouter benchmark script
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/                  # React app (see frontend/README.md)
└── docs/
    ├── A-innovation.docx
    ├── B-conception.docx
    ├── C-data-privacy.docx
    ├── D-security.docx
    └── collaboration-log.md
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env
# Add your GROQ_API_KEY to .env (get it from https://console.groq.com)
npm install
npm start
```

Server runs on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | No | Health check |
| GET | /api/topics | No | List of available topics |
| POST | /api/auth/login | No | Login, returns JWT token |
| POST | /api/chat | Yes | Send message, get adaptive response |

### Example: Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "password": "password123"}'
```

### Example: Chat

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is CAP theorem?", "topic": "cap-theorem", "difficultyLevel": 2}'
```

## Team

- **Irina Kiseleva** - Backend, GenAI integration, Security
- **Paulo-Rogerio Guimaraes-Filho** - Frontend, Conception, Data Privacy


# Collaboration Log

## Team Members
- Irina Kiseleva (Person A) — Backend, GenAI integration, Security
- Paulo-Rogerio Guimaraes-Filho (Person B) — Frontend, Conception, Data Privacy

---

## Irina Kiseleva — Contribution Log

| Date | Task | Description | Decisions Made |
|------|------|-------------|----------------|
| 22/06/2026 | Project setup | Created GitHub repository, invited professor (lostmart) and teammate as collaborators. Set up .gitignore and project folder structure (backend/src/routes, backend/src/services) | Chose monorepo structure with separate backend/ and frontend/ folders to keep concerns separated and make it easy for teammate to work independently on frontend |
| 22/06/2026 | Backend skeleton | Set up Express server with package.json, configured ES modules (type: module), installed dependencies (express, cors, dotenv, groq-sdk, jsonwebtoken) | Used ES modules instead of CommonJS because it is more modern and consistent with how the Groq SDK and other packages are written |
| 22/06/2026 | Topics endpoint | Implemented GET /api/topics returning a list of 6 distributed systems topics (CAP Theorem, Saga Pattern, Consistent Hashing, Replication, Idempotency, Message Queues) | Hardcoded the topic list for the prototype instead of storing in a database, to keep the setup simple and focus on the AI integration |
| 22/06/2026 | Groq integration | Implemented POST /api/chat endpoint calling Groq's llama-3.1-8b-instant model with adaptive difficulty logic | Had to use lazy initialization for the Groq client (create it on first call, not at module load time) because ES module imports are resolved before dotenv.config() runs, which caused the API key to be undefined at startup |
| 22/06/2026 | Adaptive difficulty logic | Implemented detectFeedbackSignal() to detect phrases like "I don't understand" or "too simple" in the user's message, and adjustDifficulty() to move the difficulty level up or down (1=beginner, 2=intermediate, 3=advanced) | Chose keyword matching over asking the LLM to classify intent, to keep latency low and avoid an extra API call on every message. The tradeoff is that it only catches explicit phrasing, not subtle hints |
| 22/06/2026 | System prompt engineering | Implemented buildSystemPrompt() which generates a different instruction for the LLM depending on the current difficulty level, and tracks previously used analogies to avoid repetition | Tested multiple prompt formulations. Found that explicitly telling the model "do not reuse these analogies" produced more varied explanations than just changing the difficulty label |
| 22/06/2026 | Git branching issues | Initially created main branch from backend-setup which made them identical, so PR showed "nothing to compare". Learned that branches must be created before committing the files that need to be tracked on that branch | Fixed by committing directly to main for the auth feature after understanding the issue. Will use correct branch workflow going forward |
| 23/06/2026 | JWT authentication | Implemented POST /api/auth/login returning a signed JWT token, and authenticateToken middleware to protect routes | Chose JWT over session-based auth because it is stateless, which fits better with a REST API and makes future horizontal scaling easier |
| 23/06/2026 | Role management | Implemented requireRole() middleware and defined two roles: student and admin | Embedded role in the JWT payload so it is checked on every request without hitting a database. Limitation: roles are static, no admin UI yet |
| 23/06/2026 | Protected /api/chat | Applied authenticateToken middleware to the chat router so unauthenticated requests return 401 | Verified manually: request without token returns {"error":"Access token required"}, request with valid token returns 200 with bot response |
| 23/06/2026 | OpenRouter benchmark | Created benchmark.js comparing 3 models across 2 providers (Groq and OpenRouter) on 3 distributed systems topics | Had to find working free-tier models by trial and error - several model slugs listed on OpenRouter returned 404 (no longer free). Final working set: meta-llama/llama-3.1-8b-instruct and qwen/qwen-2.5-7b-instruct on OpenRouter, llama-3.1-8b-instant on Groq |
| 23/06/2026 | Benchmark results | Groq: avg 699ms, OpenRouter Llama: avg 7424ms, OpenRouter Qwen: avg 6360ms. Response quality comparable across all three (~1200-1450 chars) | Chose Groq as primary provider based on ~10x speed advantage with no quality tradeoff. OpenRouter remains useful for benchmarking alternative models |
| 23/06/2026 | Security document | Wrote D-security.docx covering JWT auth, role management, and a threat table with 6 threats (Brute Force, JWT Theft, Privilege Escalation, Prompt Injection, API Key Exposure, CORS Misconfiguration) | Identified Prompt Injection as the most interesting threat specific to LLM applications - mitigated by keeping user input separate from the system prompt, but acknowledged it is not fully tested |

---

## Paulo-Rogerio Guimaraes-Filho — Contribution Log

| Date | Task | Description | Decisions Made |
|------|------|-------------|----------------|
| | | | |

---

## Notes
- API keys (Groq, OpenRouter) are stored in .env which is gitignored and never committed
- GenAI usage is logged separately in GenAI-log.docx

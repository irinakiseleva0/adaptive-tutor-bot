import express from "express"

const router = express.Router()

const TOPICS = [
  {
    id: "cap-theorem",
    title: "CAP Theorem",
    description: "Consistency, Availability, Partition tolerance trade-offs"
  },
  {
    id: "saga-pattern",
    title: "Saga Pattern",
    description: "Managing distributed transactions across microservices"
  },
  {
    id: "consistent-hashing",
    title: "Consistent Hashing",
    description: "Distributing data across nodes with minimal reshuffling"
  },
  {
    id: "replication",
    title: "Replication",
    description: "Keeping copies of data in sync across nodes"
  },
  {
    id: "idempotency",
    title: "Idempotency",
    description: "Making operations safe to retry"
  },
  {
    id: "message-queues",
    title: "Message Queues",
    description: "Asynchronous communication between services"
  }
]

// GET /api/topics
router.get("/", (req, res) => {
  res.json(TOPICS)
})

export default router
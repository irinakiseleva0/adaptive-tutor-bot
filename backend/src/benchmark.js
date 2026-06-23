import dotenv from "dotenv"
dotenv.config()

import OpenAI from "openai"

const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
})

const groq = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
})

const MODELS = [
    { id: "meta-llama/llama-3.1-8b-instruct", client: openrouter, provider: "OpenRouter" },
    { id: "qwen/qwen-2.5-7b-instruct", client: openrouter, provider: "OpenRouter" },
    { id: "llama-3.1-8b-instant", client: groq, provider: "Groq" }
]

const TEST_PROMPTS = [
    {
        topic: "CAP Theorem",
        message: "Explain the CAP theorem to an intermediate level student."
    },
    {
        topic: "Saga Pattern",
        message: "What is the saga pattern in distributed systems?"
    },
    {
        topic: "Consistent Hashing",
        message: "Explain consistent hashing with a real-world analogy."
    }
]

async function testModel(model, prompt) {
    const start = Date.now()

    try {
        const response = await model.client.chat.completions.create({
            model: model.id,
            messages: [
                { role: "system", content: "You are a distributed systems tutor. Be concise and clear." },
                { role: "user", content: prompt.message }
            ],
            max_tokens: 300
        })

        const duration = Date.now() - start
        const reply = response.choices[0].message.content

        return {
            model: model.id,
            provider: model.provider,
            topic: prompt.topic,
            duration_ms: duration,
            response_length: reply.length,
            reply: reply.substring(0, 200) + "...",
            status: "success"
        }
    } catch (error) {
        console.log(`  Error details: ${error.message}`)
        return {
            model: model.id,
            provider: model.provider,
            topic: prompt.topic,
            duration_ms: Date.now() - start,
            status: "error",
            error: error.message
        }
    }
}

async function runBenchmark() {
    console.log("Starting benchmark...\n")
    console.log("Models:")
    MODELS.forEach(m => console.log(`  - ${m.id} (${m.provider})`))
    console.log("Prompts:", TEST_PROMPTS.length)
    console.log("=".repeat(60))

    const results = []

    for (const prompt of TEST_PROMPTS) {
        console.log(`\nTopic: ${prompt.topic}`)
        for (const model of MODELS) {
            console.log(`  Testing ${model.id} (${model.provider})...`)
            const result = await testModel(model, prompt)
            results.push(result)
            console.log(`  ✓ ${result.status} — ${result.duration_ms}ms — ${result.response_length || 0} chars`)
            await new Promise(r => setTimeout(r, 500))
        }
    }

    console.log("\n" + "=".repeat(60))
    console.log("BENCHMARK RESULTS SUMMARY")
    console.log("=".repeat(60))

    for (const model of MODELS) {
        const modelResults = results.filter(r => r.model === model.id && r.status === "success")
        if (modelResults.length === 0) {
            console.log(`\n${model.id} (${model.provider}): all requests failed`)
            continue
        }
        const avgDuration = Math.round(modelResults.reduce((s, r) => s + r.duration_ms, 0) / modelResults.length)
        const avgLength = Math.round(modelResults.reduce((s, r) => s + r.response_length, 0) / modelResults.length)
        console.log(`\n${model.id} (${model.provider}):`)
        console.log(`  Avg response time: ${avgDuration}ms`)
        console.log(`  Avg response length: ${avgLength} chars`)
        console.log(`  Success rate: ${modelResults.length}/${TEST_PROMPTS.length}`)
    }

    console.log("\n" + "=".repeat(60))
    console.log("Full results saved to benchmark-results.json")

    const fs = await import("fs")
    fs.writeFileSync("benchmark-results.json", JSON.stringify(results, null, 2))
}

runBenchmark()
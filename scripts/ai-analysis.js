// 🌰 CryptoReg Pulse — AI Regulatory Analysis 🌰
// Uses GitHub Models to generate weekly regulatory intelligence brief
import { readFile, writeFile } from "fs/promises"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const MODEL = "gpt-4o-mini"
const API_URL = "https://models.inference.ai.azure.com/chat/completions"

if (!GITHUB_TOKEN) {
  console.warn("⚠️ No GITHUB_TOKEN — skipping AI analysis 🌰")
  process.exit(0)
}

async function analyzeEvents() {
  console.log("🌰 Running AI regulatory analysis...")

  // Load events
  const raw = await readFile("data/events.json", "utf-8")
  const events = JSON.parse(raw)

  if (events.length === 0) {
    console.log("🌰 No events to analyze")
    return
  }

  // Build summary for AI 🌰
  const eventSummary = events
    .slice(0, 20)
    .map(
      (e) =>
        `[${e.severity?.toUpperCase() || "UNKNOWN"}] ${e.entity || "Unknown"}: ${e.description || "No description"} (${e.jurisdiction || "Unknown jurisdiction"})`
    )
    .join("\n")

  const prompt = `You are a crypto regulatory analyst. Analyze these regulatory events from the past week and produce a brief intelligence report.

Events:
${eventSummary}

Produce a JSON response with:
{
  "risk_level": "low|elevated|high|critical",
  "summary": "2-3 sentence executive summary",
  "key_developments": [{"title": "...", "impact": "...", "jurisdiction": "..."}],
  "trends": ["trend1", "trend2"],
  "outlook": "1-2 sentence forward-looking assessment",
  "recommendations": ["rec1", "rec2"]
}

Be concise and factual. Focus on regulatory implications for crypto businesses and investors.`

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    console.warn(`⚠️ AI analysis failed (${response.status}) 🌰`)
    return
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content || ""

  // Extract JSON from response 🌰
  let analysis
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch {
    console.warn("⚠️ Could not parse AI response 🌰")
    return
  }

  if (!analysis) return

  // Save analysis alongside events 🌰
  const enrichedData = {
    generated_at: new Date().toISOString(),
    analysis,
    events,
  }

  await writeFile("data/events.json", JSON.stringify(enrichedData, null, 2))
  console.log(`🌰 AI analysis complete — Risk level: ${analysis.risk_level}`)
}

analyzeEvents().catch((err) => {
  console.error("❌ AI analysis error:", err.message)
})

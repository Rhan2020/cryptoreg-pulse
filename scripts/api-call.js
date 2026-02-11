// 🌰 CryptoReg Pulse — Regulatory Intelligence Data Fetcher 🌰
import { writeFile, readFile, mkdir } from "fs/promises"

const API_URL = "https://cpw-tracker.p.rapidapi.com/"
const API_KEY = process.env.RAPIDAPI_KEY

if (!API_KEY) {
  console.error("Error: RAPIDAPI_KEY environment variable is required")
  process.exit(1)
}

// 🌰 Date range: last 7 days for comprehensive regulatory coverage
function getDateRange() {
  const now = new Date()
  const endTime = now
  const startTime = new Date(now)
  startTime.setDate(startTime.getDate() - 7) // 🌰 Full week lookback
  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  }
}

// 🌰 Multiple query configurations for broad regulatory coverage
const QUERIES = [
  { entities: "cryptocurrency exchanges", topic: "regulatory action" },
  { entities: "cryptocurrency exchanges", topic: "sanctions" },
  { entities: "DeFi protocols", topic: "regulatory action" },
  { entities: "financial regulators", topic: "cryptocurrency enforcement" },
]

// 🌰 Fetch data for a single query
async function fetchQuery(query) {
  const { startTime, endTime } = getDateRange()

  console.log(`🌰 Fetching: ${query.entities} / ${query.topic}`)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "cpw-tracker.p.rapidapi.com",
      "x-rapidapi-key": API_KEY,
    },
    body: JSON.stringify({
      entities: query.entities,
      topic: query.topic,
      startTime,
      endTime,
    }),
  })

  if (!response.ok) {
    console.warn(`⚠️ Query failed (${response.status}): ${query.entities} / ${query.topic}`)
    return []
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

// 🌰 Classify severity based on content keywords
function classifySeverity(event) {
  const text = `${event.description || ""} ${event.entity || ""}`.toLowerCase()

  if (text.match(/ban|prohibit|criminal|arrest|indictment|shutdown|critical|emergency/))
    return "critical"
  if (text.match(/enforcement|fine|penalty|sanction|lawsuit|sec |cftc|doj/))
    return "high"
  if (text.match(/investigation|probe|warning|guidance|review|compliance/))
    return "medium"
  return "low"
}

// 🌰 Extract jurisdiction from event content
function extractJurisdiction(event) {
  const text = `${event.description || ""} ${event.entity || ""}`.toLowerCase()

  const jurisdictions = {
    "United States": /\b(sec|cftc|doj|fincen|ofac|us |united states|american|federal)\b/,
    "European Union": /\b(eu |mica|esma|european|brussels)\b/,
    "United Kingdom": /\b(fca|uk |britain|british|london)\b/,
    "China": /\b(china|chinese|pboc|beijing)\b/,
    "Japan": /\b(japan|jfsa|japanese|tokyo)\b/,
    "Singapore": /\b(singapore|mas )\b/,
    "South Korea": /\b(korea|korean|seoul)\b/,
    "Hong Kong": /\b(hong kong|hkma|sfc)\b/,
    "Australia": /\b(australia|asic|australian)\b/,
    "Global": /\b(global|international|fatf|g20|iosco)\b/,
  }

  for (const [name, pattern] of Object.entries(jurisdictions)) {
    if (pattern.test(text)) return name
  }
  return "Other"
}

// 🌰 Deduplicate events by description similarity
function deduplicateEvents(events) {
  const seen = new Set()
  return events.filter((e) => {
    const key = `${e.entity}-${(e.description || "").slice(0, 80)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 🌰 Main data pipeline
async function updateData() {
  try {
    console.log("🌰 CryptoReg Pulse — Starting regulatory scan...")

    // Fetch all queries
    let allEvents = []
    for (const query of QUERIES) {
      const results = await fetchQuery(query)
      allEvents.push(...results)
    }

    console.log(`🌰 Raw results: ${allEvents.length} events`)

    // Deduplicate
    allEvents = deduplicateEvents(allEvents)
    console.log(`🌰 After dedup: ${allEvents.length} events`)

    // Enrich with severity and jurisdiction
    const enriched = allEvents.map((event) => ({
      ...event,
      severity: event.severity || classifySeverity(event),
      jurisdiction: extractJurisdiction(event),
      category: categorizeEvent(event),
    }))

    // Sort by timestamp (newest first)
    enriched.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))

    // Load history
    let history = []
    try {
      const raw = await readFile("data/history.json", "utf-8")
      history = JSON.parse(raw)
    } catch {
      // No history yet 🌰
    }

    // Add current week snapshot
    history.push({
      week: new Date().toISOString().slice(0, 10),
      count: enriched.length,
      critical: enriched.filter((e) => e.severity === "critical").length,
      high: enriched.filter((e) => e.severity === "high").length,
    })

    // Keep last 52 weeks 🌰
    if (history.length > 52) history = history.slice(-52)

    // Save
    await mkdir("data", { recursive: true })
    await writeFile("data/events.json", JSON.stringify(enriched, null, 2))
    await writeFile("data/history.json", JSON.stringify(history, null, 2))

    console.log(`🌰 Saved ${enriched.length} regulatory events`)
    console.log("🌰 CryptoReg Pulse update complete!")
  } catch (error) {
    console.error("❌ Update failed:", error.message)
    process.exit(1)
  }
}

// 🌰 Categorize regulatory events
function categorizeEvent(event) {
  const text = `${event.description || ""}`.toLowerCase()

  if (text.match(/enforcement|fine|penalty|charged|sued/)) return "Enforcement"
  if (text.match(/sanction|ofac|blacklist|designat/)) return "Sanctions"
  if (text.match(/licens|registr|framework|legislation|bill|law/)) return "Policy"
  if (text.match(/investigation|probe|subpoena|inquiry/)) return "Investigation"
  if (text.match(/guidance|advisory|warning|alert/)) return "Guidance"
  return "General"
}

updateData()

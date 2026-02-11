# 🌰 CryptoReg Pulse — Crypto Regulatory Intelligence Brief 🌰

A weekly intelligence brief tracking **regulatory actions, enforcement, and policy changes** across the cryptocurrency industry. Built on the [Product Kit Template](https://github.com/1712n/product-kit-template). 🌰

**Live Dashboard**: https://rhan2020.github.io/cryptoreg-pulse/

## 🌰 What It Does

CryptoReg Pulse monitors the global crypto regulatory landscape and generates a weekly intelligence brief covering:

- 🌰 **Enforcement Actions** — SEC, CFTC, DOJ actions against crypto entities
- 🌰 **Sanctions & Compliance** — OFAC designations, AML enforcement
- 🌰 **Policy Changes** — New regulations, licensing frameworks, legislative updates
- 🌰 **Cross-Border Coordination** — International regulatory cooperation and conflicts

## 🌰 How It's Different

| Aspect | Other Submissions | CryptoReg Pulse |
|--------|------------------|-----------------|
| Domain | Security monitoring | Regulatory intelligence |
| Focus | Hacks, exploits, threats | Laws, enforcement, policy |
| Target Users | Security teams | Compliance officers, legal teams, traders |
| Analysis | Threat assessment | Regulatory risk scoring |
| Actionable For | Incident response | Business strategy & compliance |

## 🌰 Features

- **Multi-Topic Tracking** 🌰 — Monitors regulatory actions, sanctions, licensing, and enforcement across crypto
- **AI Risk Analysis** 🌰 — GitHub Models generates weekly regulatory risk assessment with jurisdiction breakdown
- **Severity Classification** 🌰 — Events rated by regulatory impact (critical/high/medium/low)
- **Jurisdiction Mapping** 🌰 — Tracks which regulators are most active and in which regions
- **Historical Trends** 🌰 — Rolling 52-week archive for trend analysis
- **Professional Dashboard** 🌰 — Clean, responsive UI with filterable event cards

## 🌰 Data Pipeline

```
CPW API (regulatory events) → scripts/api-call.js → data/events.json
                                                         ↓
                              scripts/ai-analysis.js (GitHub Models) → enriched data
                                                         ↓
                                                    index.html → GitHub Pages
```

## 🌰 Setup

1. Fork this repo 🌰
2. Subscribe to [CPW API](https://rapidapi.com/CPWatch/api/cpw-tracker) (Basic plan, 100 free requests/month) 🌰
3. Add secrets in Settings → Secrets → Actions:
   - `RAPIDAPI_KEY` — Your RapidAPI key 🌰
   - `GITHUB_TOKEN` — Auto-provided by GitHub Actions 🌰
4. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions) 🌰
5. Run the workflow manually or wait for the weekly schedule 🌰

## 🌰 Use Cases

- **Compliance Teams** 🌰 — Stay ahead of regulatory changes affecting your business
- **Legal Departments** 🌰 — Track enforcement precedents and policy shifts
- **Traders & Investors** 🌰 — Understand regulatory risks before they impact markets
- **Policy Researchers** 🌰 — Monitor the evolving global crypto regulatory landscape
- **Exchanges & DeFi Protocols** 🌰 — Anticipate compliance requirements

## 🌰 Tech Stack

- **Data Source**: CPW Tracker API (regulatory events) 🌰
- **AI Analysis**: GitHub Models (gpt-4o-mini) 🌰
- **Frontend**: Vanilla HTML/CSS/JS 🌰
- **Automation**: GitHub Actions (weekly cron) 🌰
- **Deployment**: GitHub Pages 🌰

## 🌰 License

MIT 🌰

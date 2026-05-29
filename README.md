# AI Resume Optimizer

A premium web app that scores your resume against a job description and surfaces targeted improvements — built for competitive finance, consulting, and tech applications.

## What it does

Upload your resume (PDF or Word) and paste a job description. The app returns:

- An **Application Strength Score** from 0–100% (shown clearly)
- **Areas Identified** and an **Optimized Summary** (blurred preview behind a paywall)
- A one-time **$9 unlock** flow (frontend-only placeholder for now)

## Stack

- **Backend:** Node.js + Express, file parsing (`pdf-parse`, `mammoth`), AI analysis API
- **Frontend:** Single-page HTML / CSS / JS (no framework, no build step)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**

   Copy `.env.example` to `.env` and add your key:
   ```bash
   cp .env.example .env
   ```
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Run the server**
   ```bash
   npm start
   ```

4. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000).

## Project structure

```
resume-optimizer/
├── server.js        # Express server, file parsing, /api/optimize
├── index.html       # Premium UI with upload + paywall
├── package.json
├── .env.example
└── README.md
```

## API

### `POST /api/optimize`

Multipart form data:

| Field | Type | Description |
|-------|------|-------------|
| `resume` | file | PDF, .doc, or .docx (max 10 MB) |
| `jobDescription` | string | Full job posting text |

**Response:**
```json
{
  "score": 78,
  "improvements": ["...", "...", "...", "...", "..."],
  "rewrittenSummary": "..."
}
```

The frontend shows the score openly and renders improvements/summary in a blurred locked state until payment is implemented.

## Notes

- API keys are read server-side from `.env` only.
- `.env` is gitignored — do not commit secrets.
- Payment (`#payment-coming-soon`) is not wired up yet.

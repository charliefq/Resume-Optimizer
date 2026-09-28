# AI Resume Optimizer

A small portfolio MVP that compares a resume with a job description and returns structured, role-specific feedback.

## What it does

- Accepts PDF and DOCX resume uploads
- Extracts resume text on the server
- Sends the resume and target job description to Anthropic
- Returns a match score, five suggested improvements, and a rewritten professional summary
- Keeps the provider API key on the server

## Project status

This is an early demonstration project, not a production recruiting service.

- The payment flow shown in the interface is a non-functional product mockup.
- The score is model-generated guidance, not a validated hiring prediction.
- Uploaded files are processed in memory and are not intentionally persisted by the application.
- Production deployment would require authentication, rate limiting, stronger document validation, monitoring, and a published retention policy.

## Stack

- Node.js and Express
- Multer for in-memory uploads
- `pdf-parse` and `mammoth` for document extraction
- Anthropic Messages API
- Plain HTML, CSS, and JavaScript

## Local setup

```bash
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## API

`POST /api/optimize` accepts multipart form data:

| Field | Type | Description |
|---|---|---|
| `resume` | file | PDF or DOCX, maximum 10 MB |
| `jobDescription` | string | Target job posting |

Example response:

```json
{
  "score": 78,
  "improvements": ["..."],
  "rewrittenSummary": "..."
}
```

## Privacy and security notes

- Do not commit `.env`; it is ignored by Git.
- Provider failures are logged server-side without returning raw upstream error bodies to the browser.
- Do not upload sensitive resumes to an untrusted deployment of this demo.

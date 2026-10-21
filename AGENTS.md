## Before any work

Before any work: read charliefq/charlie-brain AGENTS.md, then 10_core/, then 30_handoffs/Resume-Optimizer.md.

## What this project does

AI Resume Optimizer: a small portfolio MVP that takes a PDF/DOCX resume plus a job description, extracts text server-side, sends it to Anthropic, and returns a match score, five improvements and a rewritten summary. Early demo, not a production service.

## Setup, run, test

- Install: `npm install` (Node >= 18)
- Env: `cp .env.example .env` and set `ANTHROPIC_API_KEY`
- Run: `npm run dev` (watch) or `npm start` (`node server.js`)
- Test: no automated tests; manually test PDF and DOCX upload end to end.
- CI: none.

## Coding conventions

- Single Express server in `server.js`, static frontend in `index.html`; plain JavaScript.
- Linter/formatter: unknown (none configured).

## What not to touch

- Secrets: never commit API keys, tokens, or credentials; never print them in logs or PRs.
- `.env` / `.env.local`: never commit; only `.env.example` (placeholder values) is tracked.
- `main` (default branch): no direct pushes. All changes go through a PR.
- `ANTHROPIC_API_KEY` must stay server-side; never expose it to `index.html`.
- Keep README claims accurate (payment flow is a mockup; score is not a hiring prediction).

---

Read `charliefq/charlie-brain/AGENTS.md` first.

## Repo notes
- Stack: Node (>=18) + Express single server (`server.js`) with a static `index.html`; multer, pdf-parse, mammoth; Anthropic API.
- Default branch: `main`. Work on a branch and open a PR against `main`.
- Run: `npm install`, copy `.env.example` to `.env` (API key stays server-side, never committed), `npm run dev`.
- No automated tests yet — manually test PDF and DOCX upload end to end.
- Early demo project: keep README claims accurate (payment flow is a mockup).

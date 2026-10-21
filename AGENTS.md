Read `charliefq/charlie-brain/AGENTS.md` first.

## Repo notes
- Stack: Node (>=18) + Express single server (`server.js`) with a static `index.html`; multer, pdf-parse, mammoth; Anthropic API.
- Default branch: `main`. Work on a branch and open a PR against `main`.
- Run: `npm install`, copy `.env.example` to `.env` (API key stays server-side, never committed), `npm run dev`.
- No automated tests yet — manually test PDF and DOCX upload end to end.
- Early demo project: keep README claims accurate (payment flow is a mockup).

require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function extractResumeText(file) {
  const name = (file.originalname || '').toLowerCase();
  const mime = file.mimetype || '';

  if (name.endsWith('.pdf') || mime === 'application/pdf') {
    const result = await pdfParse(file.buffer);
    return result.text || '';
  }

  if (name.endsWith('.docx') || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || '';
  }

  if (name.endsWith('.doc')) {
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value || '';
    } catch {
      throw new Error('Legacy .doc files are not fully supported. Please upload a PDF or .docx.');
    }
  }

  throw new Error('Unsupported file type. Upload a PDF or .docx file.');
}

app.post('/api/optimize', upload.single('resume'), async (req, res) => {
  try {
    const jobDescription = (req.body.jobDescription || '').trim();

    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Analysis is temporarily unavailable. Please try again later.'
      });
    }

    const resumeText = (await extractResumeText(req.file)).trim();
    if (!resumeText) {
      return res.status(400).json({
        error: 'Could not extract any text from the uploaded resume.'
      });
    }

    const systemPrompt = 'You are an expert resume coach. Given this resume and job description, provide: 1) A match score from 0-100%, 2) Top 5 specific improvements the candidate should make, 3) A rewritten professional summary optimized for this role. Format your response as JSON with keys: score, improvements (array), rewrittenSummary';

    const userMessage = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nReturn ONLY valid JSON with the keys: score (number 0-100), improvements (array of 5 strings), rewrittenSummary (string). Do not include any markdown code fences or extra commentary.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic request failed', response.status, errText.slice(0, 500));
      return res.status(502).json({
        error: 'The analysis provider is temporarily unavailable.'
      });
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text ?? '';
    const parsed = extractJson(rawText);

    if (!parsed) {
      console.error('Could not parse the analysis result.');
      return res.status(502).json({
        error: 'The analysis provider returned an invalid response.'
      });
    }

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown server error.' });
  }
});

function extractJson(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch {}

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    try { return JSON.parse(fence[1]); } catch {}
  }

  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    try { return JSON.parse(text.slice(first, last + 1)); } catch {}
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Resume optimizer running at http://localhost:${PORT}`);
});

# Maestro — Competitor Ad Intelligence
### Mosaic Wellness Fellowship 2026 · Khushi Sharma

Real-time competitive ad intelligence for BeBodywise, Man Matters, and Little Joys. Tracks 10 competitor brands on Meta Ad Library, surfaces creative gaps, and generates a weekly AI brief — automatically.

**Live at:** `builderchallengekhushi.online`

---

## What it does

- Tracks 319 active competitor ads across 10 brands
- Filters by brand, format (video / carousel / static), and performance
- AI Gap Analysis — finds creative whitespace competitors aren't using
- **Aria** — AI chat assistant powered by GPT-4o, answers strategic questions about competitor ads
- Weekly Brief — auto-regenerated every Monday via GitHub Actions

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JS (single file, no build step) |
| API | Node.js serverless functions on Vercel |
| AI | GPT-4o via OpenAI API |
| Hosting | Vercel |
| Automation | GitHub Actions (weekly cron) |

---

## Repo structure

```
maestro/
├── public/
│   └── index.html          ← full dashboard UI (untouched)
├── api/
│   ├── aria.js             ← Aria chatbot endpoint (POST /api/aria)
│   ├── brief.js            ← weekly brief generator (POST /api/brief)
│   └── data.js             ← ad data endpoint (GET /api/data)
├── data/
│   └── brief.json          ← latest generated brief (updated weekly)
├── .github/
│   └── workflows/
│       └── weekly.yml      ← Monday 07:00 UTC cron
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## Deploy in 3 steps

### 1. Push to GitHub
Upload all files to a new GitHub repository.

### 2. Deploy to Vercel
1. vercel.com → New Project → import your GitHub repo
2. Add environment variables:
   - `OPENAI_API_KEY` — from platform.openai.com
   - `CRON_SECRET` — any random string (e.g. generate at generate-secret.vercel.app/32)
3. Click Deploy

### 3. Add GitHub secrets (for weekly automation)
GitHub repo → Settings → Secrets → Actions → New secret:
- `VERCEL_APP_URL` — your Vercel URL e.g. `https://maestro.vercel.app`
- `CRON_SECRET` — same value as in Vercel

That's it. The brief regenerates automatically every Monday. Aria works immediately after deploy.

---

## API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/aria` | POST | Aria chatbot — body: `{ query, context }` |
| `/api/brief` | POST | Regenerate weekly brief (requires `x-cron-secret` header) |
| `/api/data` | GET | Returns brand + ad metadata as JSON |

---

*Built for the Mosaic Wellness Builder Challenge 2026.*

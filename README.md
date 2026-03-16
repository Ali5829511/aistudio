<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# منصة شركة رمز الإبداع لإدارة الأملاك

تطبيق متكامل لإدارة الأملاك العقارية، المحاسبة، والصيانة.

View in AI Studio: https://ai.studio/apps/672e6127-b715-4727-9d79-6f6acdcb72f8

---

## Run Locally (Development)

**Prerequisites:** Node.js ≥ 20

```bash
npm install
# copy .env.example → .env.local and fill in your values
cp .env.example .env.local
npm run dev:full      # starts both API (port 3001) and Vite (port 3000)
```

---

## Deploy

### Option 1 — Docker (Recommended for production)

```bash
# Build & run
docker build -t aistudio .
docker run -d \
  -p 3001:3001 \
  -v aistudio_data:/app/data \
  -e GEMINI_API_KEY=your_key \
  -e ADMIN_PASSWORD=your_secure_password \
  --name aistudio \
  aistudio

# Open http://localhost:3001
```

The container serves the full app (frontend + API) on a single port.  
SQLite data is persisted in the `aistudio_data` Docker volume.

### Option 2 — Plain Node.js server

```bash
npm install
npm run build          # builds frontend to dist/
GEMINI_API_KEY=... ADMIN_PASSWORD=... npm start
# → http://localhost:3001
```

### Option 3 — Netlify (frontend only)

Push to GitHub and connect the repo to [Netlify](https://app.netlify.com).  
Build command: `npm run build` | Publish directory: `dist`  
> ⚠ Netlify hosts the frontend only. The Express API and SQLite database will not run.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini AI key | *(required for AI features)* |
| `ADMIN_PASSWORD` | Initial admin password on first run | `Admin@1234` |
| `API_PORT` | Express server port | `3001` |
| `DB_PATH` | Path to SQLite database file | `data/aistudio.db` |

---

## Admin Login

The system admin account (`aliayashi522@gmail.com`) is created automatically on first startup.  
Default password: set via `ADMIN_PASSWORD` environment variable (defaults to `Admin@1234`).

> **Change the password after first login.**

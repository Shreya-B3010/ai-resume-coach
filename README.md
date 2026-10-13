# AI Resume Coach

Analyze a resume, explore career guidance, and practice interview answers with
a career profile built from your resume.

## Live app

- **Website:** [AI Resume Coach](https://ai-resume-coach-frontend.onrender.com)
- **Backend health:** [Check the API](https://ai-resume-coach-lhve.onrender.com/api/health)

Create an account or sign in before using the resume analyzer and career tools.
Render's free backend may take around 50 seconds to wake after inactivity.

## Current live features

The Gemini API key is not currently configured in the production backend.
Until a replacement key is available:

- Resume analysis uses local, rule-based checks. Resume text is not sent to an
  AI provider in this mode.
- Career Coach replies with offline guidance based on the analyzed profile.
- Mock Interview uses prepared practice questions and heuristic feedback.
- Offline results are labeled; they are not AI-generated.

The backend switches to Gemini when `GEMINI_API_KEY` is configured. Gemini's
free tier has quotas, and Google may use submitted content to improve its
products. The app does not switch to a paid tier automatically. Do not upload
sensitive information when using Gemini's free tier.

## Run locally

Requirements: Node.js and npm.

1. Configure `backend/.env` using [`backend/.env.example`](./backend/.env.example).
   `DATABASE_URL` and `JWT_SECRET` are required. `GEMINI_API_KEY` is optional;
   without it, offline analysis and guidance remain available.
2. Install and start the backend:

   ```powershell
   cd backend
   npm install
   npm start
   ```

3. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

The local frontend is served at `http://localhost:5173`. Configure
`VITE_API_ORIGIN` in the frontend environment if the backend is not at its
default `http://localhost:5000` address.

## Verification

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

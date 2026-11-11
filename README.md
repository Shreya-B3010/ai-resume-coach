# AI Resume Coach

Analyze resumes, get career guidance, and practice interviews.

**Website:** [AI Resume Coach](https://ai-resume-coach-frontend.onrender.com)

## Features

- Resume analysis, career coaching, and mock interview practice.
- Uses Gemini when `GEMINI_API_KEY` is configured; otherwise uses offline,
  rule-based and prepared results.
- With Gemini enabled, submitted content is sent to Google for processing.

## Run locally

Requirements: Node.js, npm, and MySQL Server.

1. Create the database in MySQL Workbench:

   ```sql
   CREATE DATABASE ai_resume_coach;
   ```

2. Configure `backend/.env` from [`backend/.env.example`](./backend/.env.example).
   Set the MySQL connection values and `JWT_SECRET`. `GEMINI_API_KEY` is optional.
3. Start the backend:

   ```powershell
   cd backend
   npm install
   npm start
   ```

4. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. See the [backend setup guide](./backend/README.md)
for details.

## Test

```powershell
cd backend
npm test
```

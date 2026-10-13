# Backend AI setup

When configured, the resume reviewer, career coach, and mock interviewer use
Google's Gemini API from the backend. Set `GEMINI_API_KEY` in the backend
environment; optionally set `GEMINI_MODEL` (defaults to `gemini-2.5-flash`).
Never put the API key in frontend variables, source control, or chat messages.

Without a Gemini key, resume analysis uses local, rule-based checks; career
guidance uses the saved profile and predefined advice; and mock interviews use
prepared questions and heuristic feedback. These offline results are labeled
and are not AI-generated. Resume text is not sent to an AI provider in offline
mode.

When Gemini is enabled, resume text, career questions, and interview answers
are sent to Google for processing. Google's Gemini API free tier has limited
quotas and states that free-tier content may be used to improve its products.
Do not send sensitive information through the free tier. The app does not
automatically switch to a paid tier; when the free quota is exhausted, AI
requests return an explicit quota error. The backend also limits authenticated
accounts to 20 AI requests per minute.

For local development, add these values to `backend/.env`. For Render, add the
key as a secret environment variable named `GEMINI_API_KEY` on the backend
service or its linked environment group, then redeploy the service. Create the
key in [Google AI Studio](https://aistudio.google.com/apikey) and keep the
project on Google's free tier; do not attach billing if you want to avoid
charges. Free quotas and model availability can change.

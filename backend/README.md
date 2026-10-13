# Backend AI setup

The resume reviewer, career coach, and mock interviewer use the OpenAI API
from the backend. Set `OPENAI_API_KEY` in the backend environment; optionally
set `OPENAI_MODEL` (defaults to `gpt-4o-mini`). Never put the API key in
frontend variables, source control, or chat messages.

Resume text and interview answers are sent to OpenAI for processing. The
OpenAI API may incur charges. The backend limits authenticated accounts to 20
AI requests per minute. If the key is missing or rejected, AI endpoints return
an explicit configuration error rather than substituting canned feedback.

For local development, add these values to `backend/.env`. For Render, add the
key as a secret environment variable on the backend service or its linked
environment group, then redeploy the service.

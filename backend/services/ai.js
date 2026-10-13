const OpenAI = require("openai");

class AIServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "AIServiceError";
    this.statusCode = statusCode;
  }
}

async function requestAIJson({
  system,
  user,
  maxCompletionTokens = 1200,
  fetchImplementation,
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new AIServiceError(
      "AI features are not configured. Add OPENAI_API_KEY to the backend environment.",
      503
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    ...(fetchImplementation ? { fetch: fetchImplementation } : {}),
  });

  let completion;

  try {
    completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: maxCompletionTokens,
    });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      throw new AIServiceError(
        "The AI provider rejected its configured API key. Check OPENAI_API_KEY in the backend environment.",
        503
      );
    }

    if (error.status === 429) {
      throw new AIServiceError(
        "The AI service is temporarily rate-limited. Please try again shortly.",
        429
      );
    }

    console.error("AI provider request failed:", {
      status: error.status,
      code: error.code,
    });
    throw new AIServiceError(
      "The AI service is temporarily unavailable. Please try again.",
      502
    );
  }

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new AIServiceError(
      "The AI service returned an empty response. Please try again."
    );
  }

  let result;

  try {
    result = JSON.parse(content);
  } catch {
    throw new AIServiceError(
      "The AI service returned an invalid response. Please try again."
    );
  }

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new AIServiceError(
      "The AI service returned an invalid response. Please try again."
    );
  }

  return result;
}

module.exports = { AIServiceError, requestAIJson };

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
  if (!process.env.GEMINI_API_KEY) {
    throw new AIServiceError(
      "AI features are not configured. Add GEMINI_API_KEY to the backend environment.",
      503
    );
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const fetchRequest = fetchImplementation || fetch;
  let response;

  try {
    response = await fetchRequest(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: maxCompletionTokens,
          },
        }),
      }
    );
  } catch (error) {
    console.error("Gemini request failed:", { name: error.name });
    throw new AIServiceError(
      "The AI service is temporarily unavailable. Please try again.",
      502
    );
  }

  let completion;

  try {
    completion = await response.json();
  } catch {
    throw new AIServiceError(
      "The AI service returned an unreadable response. Please try again."
    );
  }

  if (!response.ok) {
    const providerStatus = completion.error?.status;

    if (response.status === 429 || providerStatus === "RESOURCE_EXHAUSTED") {
      throw new AIServiceError(
        "The Gemini free-tier quota is temporarily unavailable or exhausted. Please try again later.",
        429
      );
    }

    if (
      [400, 401, 403].includes(response.status) ||
      ["INVALID_ARGUMENT", "PERMISSION_DENIED", "UNAUTHENTICATED"].includes(
        providerStatus
      )
    ) {
      throw new AIServiceError(
        "Gemini rejected its API configuration. Check GEMINI_API_KEY and GEMINI_MODEL in the backend environment.",
        503
      );
    }

    console.error("Gemini provider request failed:", {
      status: response.status,
      providerStatus,
    });
    throw new AIServiceError(
      "The AI service is temporarily unavailable. Please try again.",
      502
    );
  }

  const content = completion.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("");

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

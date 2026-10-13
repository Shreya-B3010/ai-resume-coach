const assert = require("node:assert/strict");
const { test } = require("node:test");
const { AIServiceError, requestAIJson } = require("./ai");

const originalApiKey = process.env.GEMINI_API_KEY;
const originalModel = process.env.GEMINI_MODEL;

function setEnvironment(apiKey) {
  if (apiKey === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = apiKey;
  }
  delete process.env.GEMINI_MODEL;
}

function restoreEnvironment() {
  if (originalApiKey === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = originalApiKey;
  }
  if (originalModel === undefined) {
    delete process.env.GEMINI_MODEL;
  } else {
    process.env.GEMINI_MODEL = originalModel;
  }
}

test("AI requests fail explicitly when no Gemini key is configured", async () => {
  setEnvironment(undefined);

  try {
    await assert.rejects(
      requestAIJson({ system: "test", user: "test" }),
      (error) =>
        error instanceof AIServiceError &&
        error.statusCode === 503 &&
        error.message.includes("GEMINI_API_KEY")
    );
  } finally {
    restoreEnvironment();
  }
});

test("AI requests return parsed JSON using Gemini's structured output API", async () => {
  setEnvironment("unit-test-key");
  let request;

  try {
    const result = await requestAIJson({
      system: "Return a JSON answer.",
      user: "Test",
      fetchImplementation: async (url, options) => {
        request = { url: String(url), options };
        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [{ text: '{"answer":"hello"}' }],
                  role: "model",
                },
                finishReason: "STOP",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      },
    });

    assert.deepEqual(result, { answer: "hello" });
    assert.match(
      request.url,
      /\/models\/gemini-2\.5-flash:generateContent$/
    );
    assert.equal(
      request.options.headers["x-goog-api-key"],
      "unit-test-key"
    );
    assert.equal(request.options.headers.authorization, undefined);
    const requestBody = JSON.parse(request.options.body);
    assert.equal(
      requestBody.generationConfig.responseMimeType,
      "application/json"
    );
    assert.equal(
      requestBody.systemInstruction.parts[0].text,
      "Return a JSON answer."
    );
    assert.deepEqual(requestBody.contents, [
      { role: "user", parts: [{ text: "Test" }] },
    ]);
  } finally {
    restoreEnvironment();
  }
});

test("Gemini authentication errors are returned without secret details", async () => {
  setEnvironment("unit-test-key");

  try {
    await assert.rejects(
      requestAIJson({
        system: "test",
        user: "test",
        fetchImplementation: async () =>
          new Response(
            JSON.stringify({
              error: {
                message: "invalid key: unit-test-key",
                status: "PERMISSION_DENIED",
              },
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          ),
      }),
      (error) =>
        error instanceof AIServiceError &&
        error.statusCode === 503 &&
        !error.message.includes("unit-test-key")
    );
  } finally {
    restoreEnvironment();
  }
});

test("Gemini free-tier exhaustion is reported without a paid fallback", async () => {
  setEnvironment("unit-test-key");

  try {
    await assert.rejects(
      requestAIJson({
        system: "test",
        user: "test",
        fetchImplementation: async () =>
          new Response(
            JSON.stringify({
              error: {
                message: "quota exceeded",
                status: "RESOURCE_EXHAUSTED",
              },
            }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          ),
      }),
      (error) =>
        error instanceof AIServiceError &&
        error.statusCode === 429 &&
        error.message.includes("free-tier quota")
    );
  } finally {
    restoreEnvironment();
  }
});

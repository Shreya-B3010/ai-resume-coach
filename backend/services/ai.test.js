const assert = require("node:assert/strict");
const { test } = require("node:test");
const { AIServiceError, requestAIJson } = require("./ai");

const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_MODEL;

function setEnvironment(apiKey) {
  if (apiKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = apiKey;
  }
  delete process.env.OPENAI_MODEL;
}

function restoreEnvironment() {
  if (originalApiKey === undefined) {
    delete process.env.OPENAI_API_KEY;
  } else {
    process.env.OPENAI_API_KEY = originalApiKey;
  }
  if (originalModel === undefined) {
    delete process.env.OPENAI_MODEL;
  } else {
    process.env.OPENAI_MODEL = originalModel;
  }
}

test("AI requests fail explicitly when no provider key is configured", async () => {
  setEnvironment(undefined);

  try {
    await assert.rejects(
      requestAIJson({ system: "test", user: "test" }),
      (error) =>
        error instanceof AIServiceError &&
        error.statusCode === 503 &&
        error.message.includes("OPENAI_API_KEY")
    );
  } finally {
    restoreEnvironment();
  }
});

test("AI requests return parsed JSON and use the configured model", async () => {
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
            id: "test",
            object: "chat.completion",
            created: 1,
            model: "gpt-4o-mini",
            choices: [
              {
                index: 0,
                message: { role: "assistant", content: '{"answer":"hello"}' },
                finish_reason: "stop",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      },
    });

    assert.deepEqual(result, { answer: "hello" });
    assert.match(request.url, /\/chat\/completions$/);
    assert.equal(request.options.headers.get("authorization"), "Bearer unit-test-key");
    assert.equal(
      JSON.parse(request.options.body).response_format.type,
      "json_object"
    );
    assert.equal(JSON.parse(request.options.body).model, "gpt-4o-mini");
  } finally {
    restoreEnvironment();
  }
});

test("AI provider authentication errors are returned without secret details", async () => {
  setEnvironment("unit-test-key");

  try {
    await assert.rejects(
      requestAIJson({
        system: "test",
        user: "test",
        fetchImplementation: async () =>
          new Response(
            JSON.stringify({
              error: { message: "invalid key: unit-test-key", type: "auth_error" },
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
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

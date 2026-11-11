const test = require("node:test");
const assert = require("node:assert/strict");
const { isDatabaseUnavailable } = require("./db");

test("classifies MySQL connection failures as unavailable", () => {
  assert.equal(isDatabaseUnavailable({ code: "ECONNREFUSED" }), true);
  assert.equal(isDatabaseUnavailable({ code: "PROTOCOL_CONNECTION_LOST" }), true);
  assert.equal(isDatabaseUnavailable({ sqlState: "08006" }), true);
});

test("does not classify application errors as database outages", () => {
  assert.equal(isDatabaseUnavailable({ code: "ER_DUP_ENTRY" }), false);
  assert.equal(isDatabaseUnavailable({ code: "ER_PARSE_ERROR" }), false);
});

const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
  createOfflineCareerAnswer,
  createOfflineInterviewQuestion,
  createOfflineInterviewFeedback,
} = require("./offline-ai");

test("offline career guidance uses profile gaps and labels itself clearly", () => {
  const answer = createOfflineCareerAnswer({
    message: "How do I improve my resume?",
    analysis: {
      improvementAreas: ["Add a targeted professional summary."],
      skills: ["JavaScript", "React"],
    },
  });

  assert.match(answer, /Offline profile-based guidance \(not AI-generated\)/);
  assert.match(answer, /Add a targeted professional summary/);
  assert.match(answer, /JavaScript, React/);
});

test("offline career guidance handles missing or malformed profile data", () => {
  const answer = createOfflineCareerAnswer({
    message: "What should I learn next?",
    analysis: null,
  });

  assert.match(answer, /Choose one skill to learn next: SQL/);
  assert.match(answer, /did not detect technical skills/);
});

test("offline interview question selection avoids questions already asked", () => {
  const first = createOfflineInterviewQuestion({
    role: "Data Analyst",
    difficulty: "Beginner",
  });
  const second = createOfflineInterviewQuestion({
    role: "Data Analyst",
    difficulty: "Beginner",
    previousQuestions: [first.question],
  });

  assert.equal(first.category, "Offline practice · Beginner");
  assert.notEqual(second.question, first.question);
});

test("offline interview feedback returns bounded, explicit heuristic feedback", () => {
  const feedback = createOfflineInterviewFeedback({
    question: "How did you improve the application?",
    answer:
      "For example, I improved the application by reducing load time. The result was a faster page.",
  });

  assert.ok(feedback.total >= 0 && feedback.total <= 100);
  assert.ok(feedback.clarityScore >= 1 && feedback.clarityScore <= 10);
  assert.match(feedback.overall, /not AI-generated/);
  assert.ok(feedback.suggestions.length > 0);
});

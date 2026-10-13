function getStrings(value, limit = 8) {
  return Array.isArray(value)
    ? value
        .filter((item) => typeof item === "string" && item.trim())
        .slice(0, limit)
        .map((item) => item.trim())
    : [];
}

function createOfflineCareerAnswer({ message, analysis = {} }) {
  const question = message.trim().toLowerCase();
  const profile =
    analysis && typeof analysis === "object" && !Array.isArray(analysis)
      ? analysis
      : {};
  const skills = getStrings(profile.skills, 12);
  const improvements = getStrings(profile.improvementAreas, 8);
  const recommendedSkills = getStrings(profile.recommendedSkills, 8);
  const projects = getStrings(profile.projectFeedback, 8);
  const nextSteps = getStrings(profile.nextSteps, 8);

  let guidance;

  if (/intern|job|ready|hire|career/.test(question)) {
    guidance =
      improvements[0] ||
      "Tailor your resume to a specific entry-level job description and make sure each listed skill is supported by a project or experience.";
  } else if (/project|build|portfolio/.test(question)) {
    guidance =
      projects[0] ||
      "Build one small project that demonstrates a skill you list, and describe the problem, your contribution, and a measurable result.";
  } else if (/resume|ats|improv|better/.test(question)) {
    guidance =
      improvements[0] ||
      "Tailor the resume to the role and add measurable outcomes to your strongest project or experience.";
  } else if (/learn|skill|study|next/.test(question)) {
    const nextSkill = recommendedSkills[0] || "SQL";
    guidance = `Choose one skill to learn next: ${nextSkill}. Practice it in a small project and add the result to your resume only when you can explain your work.`;
  } else {
    guidance =
      nextSteps[0] ||
      "Choose a target role, compare your resume with a relevant job description, and address the most important evidence gap first.";
  }

  const profileContext = skills.length
    ? ` Your resume lists ${skills.slice(0, 4).join(", ")}${skills.length > 4 ? ", among other skills" : ""}.`
    : " Your resume analysis did not detect technical skills; make sure your skills are clearly listed.";

  return `Offline profile-based guidance (not AI-generated): ${guidance}${profileContext}`;
}

const interviewQuestions = {
  general: [
    "Tell me about a project you worked on and the part you personally contributed.",
    "Describe a technical problem you faced and the steps you took to solve it.",
    "How do you decide what to investigate when an application produces an unexpected result?",
    "Tell me about a time you had to learn a new tool or concept to complete a task.",
    "How would you explain a technical decision to a teammate who is new to the project?",
    "What would you improve first in a project you recently completed, and why?",
  ],
  "data analyst": [
    "How would you check a dataset for missing values, duplicates, and inconsistent formats?",
    "Describe how you would choose a chart to explain a trend to a non-technical audience.",
    "How would you investigate two reports that show different values for the same metric?",
    "What steps would you take before using a dataset to support a business recommendation?",
    "How would you explain the difference between correlation and causation?",
    "Describe a useful question you could answer with SQL and how you would structure the query.",
  ],
  "frontend developer": [
    "How would you make a page usable on both a mobile phone and a desktop?",
    "How do you investigate a user interface that renders differently than expected?",
    "What steps would you take to make an interactive form accessible?",
    "How would you decide which state belongs in a component and which should be shared?",
    "How would you improve the performance of a page with many rendered items?",
    "Describe how you would test an important user interaction in a web application.",
  ],
  "machine learning engineer": [
    "How would you split data to evaluate a supervised learning model fairly?",
    "What would you investigate if a model performs well on training data but poorly on new data?",
    "How would you choose an evaluation metric for an imbalanced classification problem?",
    "Describe how data leakage could make a model evaluation misleading.",
    "How would you monitor a deployed model for changes in its input data?",
    "How would you explain a model's prediction and its limitations to a stakeholder?",
  ],
};

function createOfflineInterviewQuestion({
  role,
  difficulty,
  previousQuestions = [],
}) {
  const roleKey = role.toLowerCase();
  const questions =
    interviewQuestions[roleKey] || interviewQuestions.general;
  const seenQuestions = getStrings(previousQuestions, 20);
  const previous = new Set(
    seenQuestions.map((question) =>
      question.toLowerCase()
    )
  );
  const available = questions.filter(
    (question) => !previous.has(question.toLowerCase())
  );
  const candidates = available.length ? available : questions;
  const question = candidates[seenQuestions.length % candidates.length];

  return {
    category: `Offline practice · ${difficulty}`,
    question,
  };
}

function createOfflineInterviewFeedback({ question, answer }) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const normalized = answer.toLowerCase();
  const hasExample = /\b(for example|for instance|when i|i built|i created|i implemented|i worked)\b/.test(
    normalized
  );
  const hasOutcome = /\b(result|impact|improved|reduced|increased|achieved|because|therefore|so that)\b/.test(
    normalized
  );
  const hasStructure = /\b(first|then|next|finally|because|therefore)\b/.test(
    normalized
  );
  const questionTerms = question
    .toLowerCase()
    .match(/[a-z0-9+#.-]{4,}/g) || [];
  const answerTerms = new Set(
    normalized.match(/[a-z0-9+#.-]{4,}/g) || []
  );
  const relevance = questionTerms.some((term) => answerTerms.has(term));
  const clarityScore = words.length < 20 ? 4 : words.length < 45 ? 6 : 8;
  const relevanceScore = relevance ? 7 : 5;
  const depthScore = (hasExample ? 2 : 0) + (hasOutcome ? 2 : 0) + 4;
  const total = Math.round(
    ((clarityScore + relevanceScore + depthScore) / 30) * 100
  );
  const suggestions = [];

  if (words.length < 35) {
    suggestions.push(
      "Add a little more detail so the interviewer can follow your reasoning."
    );
  }
  if (!hasExample) {
    suggestions.push(
      "Include a specific example and clarify what you personally did."
    );
  }
  if (!hasOutcome) {
    suggestions.push(
      "Explain the result or what you learned; use a real metric if you have one."
    );
  }
  if (!hasStructure) {
    suggestions.push(
      "Organize the answer into the situation, your actions, and the outcome."
    );
  }

  return {
    total,
    clarityScore,
    relevanceScore,
    depthScore,
    overall:
      "Offline heuristic feedback (not AI-generated): scores reflect answer length, question-word overlap, and example/result signals; review the suggestions as prompts, not a definitive evaluation.",
    suggestions: suggestions.slice(0, 4),
  };
}

module.exports = {
  createOfflineCareerAnswer,
  createOfflineInterviewQuestion,
  createOfflineInterviewFeedback,
};

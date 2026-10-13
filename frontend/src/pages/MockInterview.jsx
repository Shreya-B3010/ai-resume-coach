import { useState } from "react";
import "./MockInterview.css";
import AppHeader from "../components/AppHeader";
import { requestAI } from "../lib/ai";

function MockInterview() {
  const [stage, setStage] = useState("setup");
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [resumeAnalysis] = useState(() => {
    try {
      const saved = sessionStorage.getItem("resumeAnalysis");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const skills = Array.isArray(resumeAnalysis?.skills)
    ? resumeAnalysis.skills
    : [];

  const score = Number(resumeAnalysis?.resumeScore || 0);

  const questionCount = 6;

  const requestQuestion = async (previousQuestions) =>
    requestAI("/api/mock-interview/question", {
      role,
      difficulty,
      skills,
      previousQuestions,
    });

  const startInterview = async () => {
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setError("");
    setIsSubmitting(true);

    try {
      const question = await requestQuestion([]);
      setCurrentQuestion(question);
      setAskedQuestions([question.question]);
      setStage("interview");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const evaluateAnswer = async () => {
    const trimmed = answer.trim();

    if (!trimmed || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await requestAI("/api/mock-interview/evaluate", {
        role,
        difficulty,
        skills,
        question: currentQuestion.question,
        answer: trimmed,
      });
      setFeedback(result.feedback);
      setStage("feedback");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = async () => {
    if (questionIndex < questionCount - 1) {
      setError("");
      setIsSubmitting(true);

      try {
        const question = await requestQuestion(askedQuestions);
        setCurrentQuestion(question);
        setAskedQuestions((previous) => [...previous, question.question]);
        setQuestionIndex((previous) => previous + 1);
        setAnswer("");
        setFeedback(null);
        setStage("interview");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStage("complete");
    }
  };

  const restartInterview = () => {
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setCurrentQuestion(null);
    setAskedQuestions([]);
    setError("");
    setStage("setup");
  };

  const goBack = () => {
    window.location.href = "/resume-analyzer";
  };

  return (
    <div className="mock-interview-page">

      <div className="interview-grid" />
      <div className="interview-glow interview-glow-blue" />
      <div className="interview-glow interview-glow-mint" />

      {/* HEADER */}

      <AppHeader active="interview">
<button type="button" className="ah-btn" onClick={goBack}>← Resume Analysis</button>
</AppHeader>

      {/* MAIN */}

      <main className="interview-main">

        {/* SETUP */}

        {stage === "setup" && (
          <section className="interview-setup">

            <div className="interview-eyebrow">
              <span />
              AI MOCK INTERVIEW
            </div>

            <h1>
              Practice like you're
              <br />
              <span>already in the room.</span>
            </h1>

            <p className="interview-intro">
              Practice realistic interview questions based
              on your career profile and get instant feedback
              on your answers.
            </p>
            <p>
              When Gemini is configured, your role, resume skills, and answers
              are sent to Google to generate questions and feedback.
              Otherwise, the interview uses offline practice questions and
              heuristic feedback, not AI. Google may use submitted content to
              improve its products when the Gemini free tier is used.
            </p>

            {error && <p role="alert">{error}</p>}

            <div className="setup-layout">

              <div className="setup-card">

                <div className="setup-card-top">
                  <span>01</span>
                  <span>INTERVIEW SETUP</span>
                </div>

                <div className="setup-field">

                  <label>
                    TARGET ROLE
                  </label>

                  <select
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                  >
                    <option>
                      Software Engineer
                    </option>

                    <option>
                      AIML Engineer
                    </option>

                    <option>
                      Machine Learning Engineer
                    </option>

                    <option>
                      Data Analyst
                    </option>

                    <option>
                      Frontend Developer
                    </option>
                  </select>

                </div>

                <div className="setup-field">

                  <label>
                    DIFFICULTY
                  </label>

                  <div className="difficulty-options">

                    {[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                    ].map((item) => (
                      <button
                        key={item}
                        className={
                          difficulty === item
                            ? "difficulty-active"
                            : ""
                        }
                        onClick={() =>
                          setDifficulty(item)
                        }
                      >
                        {item}
                      </button>
                    ))}

                  </div>

                </div>

                <button
                  className="start-interview-button"
                  onClick={startInterview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating your first question..." : "Start Mock Interview"}
                  <span>→</span>
                </button>

              </div>

              <div className="profile-interview-card">

                <span>
                  YOUR PROFILE
                </span>

                <div className="profile-interview-score">
                  <strong>{score}</strong>
                  <small>/100</small>
                </div>

                <p>
                  Resume performance
                </p>

                <div className="profile-interview-divider" />

                <span>
                  SKILLS AVAILABLE TO THE COACH
                </span>

                <div className="interview-skill-list">

                  {skills
                    .slice(0, 8)
                    .map((skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    ))}

                  {skills.length === 0 && (
                    <span>
                      Upload a resume first
                    </span>
                  )}

                </div>

              </div>

            </div>

            <div className="interview-features">

              <div>
                <span>01</span>
                <strong>Real questions</strong>
                <p>
                  Practice questions commonly asked
                  in technical interviews.
                </p>
              </div>

              <div>
                <span>02</span>
                <strong>Instant feedback</strong>
                <p>
                  Understand the clarity and depth
                  of your answers.
                </p>
              </div>

              <div>
                <span>03</span>
                <strong>Improve faster</strong>
                <p>
                  Use feedback to make your next
                  answer stronger.
                </p>
              </div>

            </div>

          </section>
        )}

        {/* INTERVIEW */}

        {stage === "interview" && (
          <section className="interview-session">

            <div className="session-top">

              <div>

                <span>
                  QUESTION {String(questionIndex + 1).padStart(2, "0")}
                  {" "}
                  / {String(questionCount).padStart(2, "0")}
                </span>

                <strong>
                  {currentQuestion.category}
                </strong>

              </div>

              <div className="session-role">
                {role}
                <i />
                {difficulty}
              </div>

            </div>

            {error && <p role="alert">{error}</p>}

            <div className="question-card">

              <div className="question-number">
                Q{String(questionIndex + 1).padStart(2, "0")}
              </div>

              <div className="question-content">

                <span>
                  INTERVIEWER
                </span>

                <h1>
                  {currentQuestion.question}
                </h1>

                <p>
                  Take a moment to structure your answer.
                  Use a specific example whenever possible.
                </p>

              </div>

            </div>

            <div className="answer-section">

              <div className="answer-label">
                <span>YOUR ANSWER</span>

                <small>
                  {answer.trim()
                    ? `${answer.trim().split(/\s+/).length} words`
                    : "Start typing your answer"}
                </small>
              </div>

              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Type your answer here..."
              />

              <div className="answer-footer">

                <span>
                  Be specific. Explain what you did,
                  why you did it, and what happened.
                </span>

                <button
                  onClick={evaluateAnswer}
                  disabled={!answer.trim() || isSubmitting}
                >
                  {isSubmitting ? "Evaluating..." : "Evaluate Answer"}
                  <span>→</span>
                </button>

              </div>

            </div>

          </section>
        )}

        {/* FEEDBACK */}

        {stage === "feedback" && feedback && (
          <section className="feedback-section">

            {error && <p role="alert">{error}</p>}

            <div className="feedback-header">

              <div>

                <span>
                  AI ANSWER REVIEW
                </span>

                <h1>
                  Here's how your answer
                  <br />
                  <span>performed.</span>
                </h1>

              </div>

              <div
                className="feedback-score"
                style={{ "--score": Number(feedback.total) || 0 }}
              >
                <strong>
                  {feedback.total}
                </strong>
                <span>/100</span>
              </div>

            </div>

            <div className="feedback-overview">

              <div className="feedback-main-card">

                <span>
                  OVERALL ASSESSMENT
                </span>

                <h2>
                  {feedback.overall}
                </h2>

                <p>
                  Your answer was evaluated for
                  clarity, relevance and depth.
                </p>

                <div className="feedback-metrics">

                  <div>
                    <span>Clarity</span>

                    <strong>
                      {feedback.clarityScore}/10
                    </strong>

                    <div>
                      <i
                        style={{
                          width: `${feedback.clarityScore * 10}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <span>Relevance</span>

                    <strong>
                      {feedback.relevanceScore}/10
                    </strong>

                    <div>
                      <i
                        style={{
                          width: `${feedback.relevanceScore * 10}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <span>Depth</span>

                    <strong>
                      {feedback.depthScore}/10
                    </strong>

                    <div>
                      <i
                        style={{
                          width: `${feedback.depthScore * 10}%`,
                        }}
                      />
                    </div>
                  </div>

                </div>

              </div>

              <div className="feedback-suggestions">

                <span>
                  COACHING NOTES
                </span>

                <h3>
                  How to improve
                </h3>

                {feedback.suggestions.map(
                  (suggestion, index) => (
                    <div
                      className="feedback-suggestion"
                      key={index}
                    >
                      <b>
                        0{index + 1}
                      </b>

                      <p>
                        {suggestion}
                      </p>
                    </div>
                  )
                )}

              </div>

            </div>

            <div className="feedback-actions">

              <button
                className="next-question-button"
                onClick={nextQuestion}
                disabled={isSubmitting}
              >
                {questionIndex <
                questionCount - 1
                  ? isSubmitting ? "Creating question..." : "Next Question"
                  : "Finish Interview"}

                <span>→</span>
              </button>

            </div>

          </section>
        )}

        {/* COMPLETE */}

        {stage === "complete" && (
          <section className="interview-complete">

            <div className="complete-icon">
              ✦
            </div>

            <span>
              INTERVIEW COMPLETE
            </span>

            <h1>
              You made it through
              <br />
              <span>the interview.</span>
            </h1>

            <p>
              You've completed all {questionCount}
              interview questions. Keep practicing,
              refine your answers, and build confidence.
            </p>

            <div className="completion-stats">

              <div>
                <strong>
                  {questionCount}
                </strong>
                <span>
                  QUESTIONS
                </span>
              </div>

              <div>
                <strong>
                  {role}
                </strong>
                <span>
                  TARGET ROLE
                </span>
              </div>

              <div>
                <strong>
                  {difficulty}
                </strong>
                <span>
                  DIFFICULTY
                </span>
              </div>

            </div>

            <button
              className="start-interview-button"
              onClick={restartInterview}
            >
              Practice Again
              <span>↻</span>
            </button>

          </section>
        )}

      </main>

      <footer className="interview-footer">
        <span>AI COACH</span>
        <span>AI MOCK INTERVIEW</span>
        <span>CAREER INTELLIGENCE</span>
      </footer>

    </div>
  );
}

export default MockInterview;